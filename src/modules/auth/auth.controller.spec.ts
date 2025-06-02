import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  const mockUser = { id: 1, email: 'rahul@gmail.com', password: 'hashedpass' };

  const responseWrapper = {
    message: 'User logged in',
    statusCode: 200,
    success: true,
    data: mockUser,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(responseWrapper),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should return token on login', async () => {
    const loginDto = {
      email: 'rahul@gmail.com',
      password: '123456',
      deviceId: 'abc',
      deviceToken: 'xyz',
    };
    const result = await authController.login(loginDto);
    expect(result).toEqual(responseWrapper);
  });
});
