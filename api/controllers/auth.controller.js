import User from '~/models/user.model';

export const signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      message: 'success',
      data: newUser,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
