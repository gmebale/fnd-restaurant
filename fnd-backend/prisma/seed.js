const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@fnd.com' },
    update: {},
    create: {
      email: 'admin@fnd.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '+212600000000',
      role: 'SUPER_ADMIN',
    },
  });

  const chef = await prisma.user.upsert({
    where: { email: 'chef@fnd.com' },
    update: {},
    create: {
      email: 'chef@fnd.com',
      password: hashedPassword,
      name: 'Chef Mohammed',
      phone: '+212600000001',
      role: 'CUISINIER',
    },
  });

  const delivery = await prisma.user.upsert({
    where: { email: 'delivery@fnd.com' },
    update: {},
    create: {
      email: 'delivery@fnd.com',
      password: hashedPassword,
      name: 'Delivery Driver',
      phone: '+212600000002',
      role: 'LIVREUR',
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@fnd.com' },
    update: {},
    create: {
      email: 'customer1@fnd.com',
      password: hashedPassword,
      name: 'Ahmed Bennani',
      phone: '+212600000003',
      role: 'CLIENT',
      points: 150,
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@fnd.com' },
    update: {},
    create: {
      email: 'customer2@fnd.com',
      password: hashedPassword,
      name: 'Fatima Alaoui',
      phone: '+212600000004',
      role: 'CLIENT',
      points: 200,
    },
  });

  console.log('✅ Users created');

  // Create addresses
  const address1 = await prisma.address.upsert({
    where: {
      userId_label: {
        userId: customer1.id,
        label: 'Maison'
      }
    },
    update: {
      street: '123 Boulevard Hassan II',
      city: 'Rabat',
      zipCode: '10000',
      isDefault: true,
    },
    create: {
      userId: customer1.id,
      label: 'Maison',
      street: '123 Boulevard Hassan II',
      city: 'Rabat',
      zipCode: '10000',
      isDefault: true,
    },
  });

  const address2 = await prisma.address.upsert({
    where: {
      userId_label: {
        userId: customer2.id,
        label: 'Bureau'
      }
    },
    update: {
      street: '456 Avenue Mohammed V',
      city: 'Rabat',
      zipCode: '10000',
      isDefault: true,
    },
    create: {
      userId: customer2.id,
      label: 'Bureau',
      street: '456 Avenue Mohammed V',
      city: 'Rabat',
      zipCode: '10000',
      isDefault: true,
    },
  });

  console.log('✅ Addresses created');

  // Create products
  const burger = await prisma.product.create({
    data: {
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, onion, and our special sauce',
      category: 'Burgers',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      available: true,
      popular: true,
      productImages: {
        create: [
          { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
          { url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400' },
        ],
      },
    },
  });

  const pizza = await prisma.product.create({
    data: {
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomato sauce, and basil on our signature crust',
      category: 'Pizzas',
      price: 65.00,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      available: true,
      popular: true,
      productImages: {
        create: [
          { url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
          { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400' },
        ],
      },
    },
  });

  const pasta = await prisma.product.create({
    data: {
      name: 'Carbonara Pasta',
      description: 'Creamy pasta with pancetta, eggs, and parmesan cheese',
      category: 'Pastas',
      price: 55.00,
      image: 'https://images.unsplash.com/photo-1551892376-c73ba8b86727?w=400',
      available: true,
      popular: false,
      productImages: {
        create: [
          { url: 'https://images.unsplash.com/photo-1551892376-c73ba8b86727?w=400' },
        ],
      },
    },
  });

  const salad = await prisma.product.create({
    data: {
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with caesar dressing and croutons',
      category: 'Salads',
      price: 35.00,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
      available: true,
      popular: false,
      productImages: {
        create: [
          { url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' },
        ],
      },
    },
  });

  const dessert = await prisma.product.create({
    data: {
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
      category: 'Desserts',
      price: 40.00,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
      available: true,
      popular: true,
      productImages: {
        create: [
          { url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
        ],
      },
    },
  });

  console.log('✅ Products created');

  // Create loyalty points
  await prisma.loyaltyPoints.upsert({
    where: { userId: customer1.id },
    update: {
      points: 150,
      totalEarned: 150,
      totalSpent: 0,
    },
    create: {
      userId: customer1.id,
      points: 150,
      totalEarned: 150,
      totalSpent: 0,
    },
  });

  await prisma.loyaltyPoints.upsert({
    where: { userId: customer2.id },
    update: {
      points: 200,
      totalEarned: 200,
      totalSpent: 0,
    },
    create: {
      userId: customer2.id,
      points: 200,
      totalEarned: 200,
      totalSpent: 0,
    },
  });

  console.log('✅ Loyalty points created');

  // Create promo codes
  const promo1 = await prisma.promoCode.upsert({
    where: { code: 'WELCOME10' },
    update: {
      type: 'PERCENTAGE',
      value: 10,
      minAmount: 100,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      usageLimit: 100,
      active: true,
    },
    create: {
      code: 'WELCOME10',
      type: 'PERCENTAGE',
      value: 10,
      minAmount: 100,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      usageLimit: 100,
      active: true,
    },
  });

  const promo2 = await prisma.promoCode.upsert({
    where: { code: 'FREESHIP' },
    update: {
      type: 'FREE_DELIVERY',
      value: 15,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      usageLimit: 50,
      active: true,
    },
    create: {
      code: 'FREESHIP',
      type: 'FREE_DELIVERY',
      value: 15,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      usageLimit: 50,
      active: true,
    },
  });

  console.log('✅ Promo codes created');

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      userId: customer1.id,
      phone: customer1.phone,
      address: address1.street,
      addressId: address1.id,
      status: 'DELIVERED',
      subtotal: 110.00,
      deliveryFee: 15.00,
      discount: 11.00,
      promoCode: promo1.code,
      total: 114.00,
      paymentMethod: 'CARD',
      paymentStatus: 'PAID',
      deliveryPersonId: delivery.id,
      deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      items: {
        create: [
          {
            productId: burger.id,
            productName: burger.name,
            productPrice: burger.price,
            quantity: 1,
            subtotal: burger.price,
          },
          {
            productId: pizza.id,
            productName: pizza.name,
            productPrice: pizza.price,
            quantity: 1,
            subtotal: pizza.price,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: customer2.id,
      phone: customer2.phone,
      address: address2.street,
      addressId: address2.id,
      status: 'PREPARING',
      subtotal: 100.00,
      deliveryFee: 0.00,
      discount: 0.00,
      promoCode: promo2.code,
      total: 100.00,
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING',
      deliveryPersonId: delivery.id,
      estimatedTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      items: {
        create: [
          {
            productId: pasta.id,
            productName: pasta.name,
            productPrice: pasta.price,
            quantity: 1,
            subtotal: pasta.price,
          },
          {
            productId: salad.id,
            productName: salad.name,
            productPrice: salad.price,
            quantity: 1,
            subtotal: salad.price,
          },
        ],
      },
    },
  });

  console.log('✅ Orders created');

  // Create reviews
  const review1 = await prisma.review.create({
    data: {
      userId: customer1.id,
      orderId: order1.id,
      productId: burger.id,
      rating: 5,
      comment: 'Excellent burger! Very juicy and flavorful. Will definitely order again.',
      reviewImages: {
        create: [
          { url: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400' },
        ],
      },
    },
  });

  // Create a review for the second order
  const review2 = await prisma.review.create({
    data: {
      userId: customer2.id,
      orderId: order2.id,
      productId: pasta.id,
      rating: 4,
      comment: 'Great pasta, but could use a bit more sauce next time.',
      reviewImages: {
        create: [
          { url: 'https://images.unsplash.com/photo-1551892376-c73ba8b86727?w=400' },
        ],
      },
    },
  });

  console.log('✅ Reviews created');

  // Create favorites
  await prisma.favorite.create({
    data: {
      userId: customer1.id,
      productId: burger.id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: customer2.id,
      productId: pizza.id,
    },
  });

  console.log('✅ Favorites created');

  // Create cart items
  await prisma.cart.upsert({
    where: { userId: customer1.id },
    update: {
      items: {
        deleteMany: {}, // Clear existing items
        create: [
          {
            productId: dessert.id,
            quantity: 2,
          },
        ],
      },
    },
    create: {
      userId: customer1.id,
      items: {
        create: [
          {
            productId: dessert.id,
            quantity: 2,
          },
        ],
      },
    },
  });

  console.log('✅ Cart items created');

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: customer1.id,
      type: 'ORDER',
      title: 'Order Delivered',
      message: 'Your order has been successfully delivered. Enjoy your meal!',
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: customer2.id,
      type: 'PROMO',
      title: 'Special Offer',
      message: 'Get 10% off on your next order with code WELCOME10!',
      read: false,
    },
  });

  console.log('✅ Notifications created');

  // Create support tickets
  await prisma.ticket.create({
    data: {
      userId: customer1.id,
      subject: 'Late Delivery',
      description: 'My order was delivered 30 minutes late today.',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      adminNotes: 'Issue resolved - apologized and offered discount on next order.',
    },
  });

  console.log('✅ Support tickets created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- ${5} users created`);
  console.log(`- ${2} addresses created`);
  console.log(`- ${5} products created`);
  console.log(`- ${2} orders created`);
  console.log(`- ${2} reviews created`);
  console.log(`- ${2} promo codes created`);
  console.log(`- And more...`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
