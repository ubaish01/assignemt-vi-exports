const User = require('./models/user.model');

exports.createDefaultUsers = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    const userExists = await User.findOne({ username: 'user' });

    if (!adminExists) {
      const admin = new User({
        username: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
      });
      await admin.save();
      console.log('Admin user created');
    }

    if (!userExists) {
      const user = new User({
        username: 'user@gmail.com',
        password: 'user123',
        role: 'user',
      });
      await user.save();
      console.log('Regular user created');
    }
  } catch (err) {
    console.error(err);
  }
};