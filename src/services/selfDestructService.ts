import prisma from '../config/prismaClient';
import { CustomError } from '../middlewares/errorHandler';

export class SelfDestructService {

  private confirmationCodes: Map<string, { 
    code: string; 
    timestamp: number;
    attempts: number;
    lastInitiated: number;
  }> = new Map(); //to handle multiple requests for initialising self destruct sequence

  private readonly MAX_ATTEMPTS = 5;
  private readonly COOLDOWN_PERIOD = 5 * 60 * 1000;
  private readonly RATE_LIMIT_WINDOW = 60 * 1000;    


  private generateConfirmationCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  private cleanupOldCodes() {
    const now = Date.now();
    for (const [gadgetId, data] of this.confirmationCodes.entries()) {
      if (now - data.timestamp > this.COOLDOWN_PERIOD) {
        this.confirmationCodes.delete(gadgetId);
      }
    }
  }

  private checkRateLimit(gadgetId: string): void {
    const data = this.confirmationCodes.get(gadgetId);
    const now = Date.now();

    if (data) {
      
      if (now - data.lastInitiated < this.RATE_LIMIT_WINDOW) {
        if (data.attempts >= this.MAX_ATTEMPTS) {
          throw new CustomError(
            `too many self destruct attempts. Please wait ${
              Math.ceil((this.RATE_LIMIT_WINDOW - (now - data.lastInitiated)) / 1000)
            } seconds before trying again`,
            429
          );
        }
      } else {
        
        data.attempts = 0;
      }
    }
  }

  async initiateSelfDestruct(gadgetId: string) {
    const gadget = await prisma.gadget.findUnique({ where: { id: gadgetId } });
    if (!gadget) throw new CustomError('Gadget not found', 404);
    
    if (gadget.status === 'DESTROYED') {
      throw new CustomError('Gadget is already destroyed', 400);
    }

    this.cleanupOldCodes();
    this.checkRateLimit(gadgetId);

    const now = Date.now();
    const existingData = this.confirmationCodes.get(gadgetId);
    const newCode = this.generateConfirmationCode();

    this.confirmationCodes.set(gadgetId, {
      code: newCode,
      timestamp: now,
      attempts: (existingData?.attempts || 0) + 1,
      lastInitiated: now
    });

    return {
      message: 'Self-destruct sequence initiated',
      confirmationCode: newCode,
      expiresIn: '5 minutes',
      remainingAttempts: this.MAX_ATTEMPTS - ((existingData?.attempts || 0) + 1),
      gadget
    };
  }

  async confirmSelfDestruct(gadgetId: string, confirmationCode: string) {
    const gadget = await prisma.gadget.findUnique({ where: { id: gadgetId } });
    if (!gadget) throw new CustomError('Gadget not found', 404);

    const storedData = this.confirmationCodes.get(gadgetId);
    if (!storedData) {
      throw new CustomError('No self-destruct sequence initiated for this gadget', 400);
    }

    if (storedData.code !== confirmationCode) {
      throw new CustomError('Invalid confirmation code', 400);
    }

    if (Date.now() - storedData.timestamp > this.COOLDOWN_PERIOD) {
      this.confirmationCodes.delete(gadgetId);
      throw new CustomError('Confirmation code expired', 400);
    }

    const updatedGadget = await prisma.gadget.update({
      where: { id: gadgetId },
      data: { status: 'DESTROYED', decommissionedAt: new Date() }
    });

    this.confirmationCodes.delete(gadgetId);

    return {
      message: 'Gadget successfully destroyed',
      gadget: updatedGadget
    };
  }
}