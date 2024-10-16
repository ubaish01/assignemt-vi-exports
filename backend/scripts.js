const User = require('./models/user.model');

const users = [
  { username: 'user1@gmail.com' },
  { username: 'user2@gmail.com' },
  { username: 'user3@gmail.com' },
  { username: 'user4@gmail.com' },
  { username: 'user5@gmail.com' },
];

exports.createDefaultUsers = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin@gmail.com' });

    if (!adminExists) {
      const admin = new User({
        username: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
      });
      await admin.save();
      console.log('Admin user created');
    }

    for (const user of users) {
      const userExists = await User.findOne({ username: user.username });
      if (!userExists) {
        const newUser = new User({
          username: user.username,
          password: 'user123',
          role: 'user',
        });
        await newUser.save();
        console.log(`User ${user.username} created`);
      }
    }
  } catch (error) {
    console.error(`Error creating default users: ${error.message}`);
  }
};