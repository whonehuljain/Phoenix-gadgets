import { GadgetStatus } from '@prisma/client';
import prisma from '../config/prismaClient';
import { CustomError } from '../middlewares/errorHandler';

const adjectives = ['Silent', 'Shadow', 'Ghost', 'Night', 'Dark', 'Swift', 'Stealth', 'Phantom'];
const nouns = ['Nightingale','Eagle', 'Wolf', 'Hawk', 'Phoenix', 'Dragon', 'Cobra', 'Panther', 'Raven'];

export class GadgetService {
  private generateCodename(): string {

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `The ${adjective} ${noun}`;
  }

  private generateSuccessProbability(): number {
    return Math.floor(Math.random() * 41) + 60;
  }


  async getAllGadgets(status?: string) {

    const where = status ? { status: status as any } : { decommissionedAt : null };
    // console.log(where);

    const gadgets = await prisma.gadget.findMany({ where });

    // console.log(gadgets);
    
    return gadgets.map(gadget => {
      const successProbability = this.generateSuccessProbability();
      return {
        ...gadget,
        successProbability: successProbability,
        codename: `${gadget.codename} - ${successProbability}% success probability`
      };
    });
  }
  


  async createGadget(name: string) {

    let codename: string;

    let isUnique = false;
    while (!isUnique) {
      codename = this.generateCodename();
      const existing = await prisma.gadget.findUnique({
        where: { codename }
      });

      if (!existing) isUnique = true;
    }

    return prisma.gadget.create({
      data: {
        name,
        codename: codename!,
        status: 'AVAILABLE'
      }
    });

  }
  


  async updateGadget(id: string, data: { name?: string; status?: GadgetStatus }) {
    const gadget = await prisma.gadget.findUnique({ where: { id } });
    if (!gadget) throw new CustomError('Gadget not found', 404);

    return prisma.gadget.update({
      where: { id },
      data
    });
  }

  async decommissionGadget(id: string) {
    const gadget = await prisma.gadget.findUnique({ where: { id } });
    if (!gadget) throw new CustomError('Gadget not found', 404);

    return prisma.gadget.update({
      where: { id },
      data: {
        status: 'DECOMMISSIONED',
        decommissionedAt: new Date()
      }
    });
  }

  
}