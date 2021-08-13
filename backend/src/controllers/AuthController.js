const jwt = require('jsonwebtoken');

const VALID_USERS = ['user1', 'user2', 'user3'];
const PASSWORD = 'user123';

class AuthController {
  async login(request, response) {
    if (!request.body.user || !request.body.password) {
      response.status(400).json({
        error: 'User or Password is missing!',
      });
    }

    const { user, password } = request.body;
    let id = 0;

    if (VALID_USERS.includes(user) && PASSWORD === password) {
      id = VALID_USERS.indexOf(user) + 1;
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 3600,
      });

      return response.json({ auth: true, token });
    }

    return response.status(401).json({
      auth: false,
      error: 'User or Password is incorrect!',
    });
  }

  async validateJWT(request, response, next) {
    const bearerToken = request.headers.authorization;
    if (!bearerToken || !bearerToken.startsWith('Bearer')) {
      return response.status(401).json({ auth: false, message: 'No token provided!' });
    }

    const token = request.headers.authorization.split(' ');
    if (token.length === 2 && token[0] === 'Bearer') {
      try {
        const decodedJwt = jwt.verify(token[1], process.env.JWT_SECRET);
        request.userId = decodedJwt.id;

        return next();
      } catch (error) {
        return response.status(500).json({
          auth: false,
          message: 'Failed to authenticate token.',
        });
      }
    }

    return response.status(500).json({
      auth: false,
      message: 'Failed to authenticate token.',
    });
  }
}

module.exports = AuthController;
