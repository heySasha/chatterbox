import { inject, injectable } from 'inversify';

import passport, { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UsersModel } from './models/users.model';
import * as bcrypt from 'bcrypt';

@injectable()
export class Passport {
    private readonly passport: PassportStatic;

    constructor(@inject('UsersModel') private users: UsersModel) {
        this.passport = passport.use(
            new LocalStrategy(
                { usernameField: 'email' },
                async (email, password, done) => {
                    const user = await this.users.getByEmail(email);

                    if (!user) {
                        return done(null, false, { message: 'User not found' });
                    }

                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, {
                            message: 'Password is wrong'
                        });
                    }

                    return done(null, user);
                }
            )
        );
    }

    public get() {
        return this.passport;
    }
}
