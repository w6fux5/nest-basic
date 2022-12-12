import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('register request', async () => {
    const sendEmail = 'e2e1@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: sendEmail, password: '123456' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(sendEmail);
      });
  });

  it('註冊後返回當前使用者', async () => {
    const sendEmail = 'e2e1@gmail.com';
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: sendEmail, password: '123456' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(sendEmail).toEqual(body.email);
  });
});
