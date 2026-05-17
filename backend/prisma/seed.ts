import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.activityReview.deleteMany()
  await prisma.productReview.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.subscriptionPlan.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.activitySlot.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // Criar produtos
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Abraço de Camomila',
        category: 'relaxar',
        tag: 'Relaxar',
        price: 100,
        weight: '40g',
        ingredients: 'camomila, melissa, lavanda',
        description: 'Infusão delicada para desacelerar o ritmo do dia.',
        image: '/hero-tea-cup.png',
      },
      {
        name: 'Aurora Verde',
        category: 'energia',
        tag: 'Energia',
        price: 92,
        weight: '50g',
        ingredients: 'chá verde, capim-limão, gengibre',
        description: 'Blend fresco, cítrico e levemente picante.',
        image: '/hero-tea-cup.png',
      },
      {
        name: 'Raiz Leve',
        category: 'digestivo',
        tag: 'Digestivo',
        price: 86,
        weight: '45g',
        ingredients: 'hortelã, funcho, anis-estrelado',
        description: 'Uma xícara aromática para depois das refeições.',
        image: '/hero-tea-cup.png',
      },
      {
        name: 'Jardim Rosa',
        category: 'floral',
        tag: 'Floral',
        price: 96,
        weight: '35g',
        ingredients: 'hibisco, rosa mosqueta, maçã',
        description: 'Frutado, rubi e perfumado, bom quente ou gelado.',
        image: '/hero-tea-cup.png',
      },
      {
        name: 'Noite Dourada',
        category: 'relaxar',
        tag: 'Relaxar',
        price: 104,
        weight: '50g',
        ingredients: 'rooibos, baunilha, canela',
        description: 'Encorpado e naturalmente sem cafeína.',
        image: '/hero-tea-cup.png',
      },
      {
        name: 'Sol de Mate',
        category: 'energia',
        tag: 'Energia',
        price: 88,
        weight: '60g',
        ingredients: 'erva-mate tostada, casca de laranja',
        description: 'Tostado, vivo e perfeito para preparo gelado.',
        image: '/hero-tea-cup.png',
      },
    ],
  })

  console.log(`✅ ${products.count} produtos criados`)

  // Criar atividades
  const activities = [
    {
      title: 'Degustação guiada',
      duration: '90 min',
      price: 80,
      description: 'Percurso sensorial por seis blends, aromas secos e infusões.',
    },
    {
      title: 'Oficina de blends',
      duration: '2h',
      price: 140,
      description: 'Criação de uma mistura autoral com ervas, flores e especiarias.',
    },
    {
      title: 'Chá e meditação',
      duration: '60 min',
      price: 65,
      description: 'Encontro intimista para respiração, presença e infusão lenta.',
    },
  ]

  for (const activity of activities) {
    const createdActivity = await prisma.activity.create({
      data: activity,
    })

    // Criar slots para cada atividade
    const slots = [
      new Date('2026-05-18T10:00:00'),
      new Date('2026-05-18T15:00:00'),
      new Date('2026-05-19T10:00:00'),
    ]

    for (const dateTime of slots) {
      await prisma.activitySlot.create({
        data: {
          activityId: createdActivity.id,
          dateTime,
          capacity: 10,
        },
      })
    }
  }

  console.log(`✅ ${activities.length} atividades criadas com slots`)

  await prisma.subscriptionPlan.createMany({
    data: [
      {
        name: 'Caixinha Essencial',
        slug: 'essencial',
        description: 'Uma seleção mensal com blends leves para conhecer novos sabores.',
        price: 119,
        benefits: ['3 blends surpresa por mês', 'Cartão com modo de preparo', 'Frete especial para assinantes'],
      },
      {
        name: 'Caixinha Encantada',
        slug: 'encantada',
        description: 'Experiência mensal completa para quem ama rituais de chá.',
        price: 189,
        benefits: ['5 blends selecionados', 'Brinde botânico mensal', 'Acesso antecipado a lançamentos'],
      },
    ],
  })

  await prisma.user.create({
    data: {
      name: 'Administrador Chá e Encantos',
      email: 'admin@chaeencantos.com.br',
      password: await bcryptjs.hash('admin123', 10),
      role: 'admin',
    },
  })

  console.log('✅ Planos de assinatura e usuário admin criados')
  console.log('🔐 Admin: admin@chaeencantos.com.br / admin123')

  console.log('🌱 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
