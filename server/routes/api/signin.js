const User = require("../../models/User")

module.exports = (app) => {

    app.post("/api/account/signup.js", (req, res, next) =>
    {
        const { body } = req;
        const {
            firstName,
            lastName,
            password,
        } = body;

        let { email } = body;

        if(!firstName)
        {
            return res.end({
                success: false,
                message: "Błąd: Imię nie może być puste"
            });
        }
        if(!lastName)
        {
            return res.end({
                success: false,
                message: "Błąd: Nazwisko nie może być puste"
            });
        }
        if(!email)
        {
            return res.end({
                success: false,
                message: "Błąd: email nie może być pusty"
            });
        }
        if(!password)
        {
            return res.end({
                success: false,
                message: "Błąd: Hasło nie może być puste"
            });
        }

        email = email.toLowerCase();

        User.find({

        }, (err, previousUser) =>{
            if(err)
            {
                return res.end({
                    success: false,
                    message: "Błąd: Błąd serwer"
                });
            }
            else if(previousUser.length > 0)
            {
                return res.end({
                    success: false,
                    message: "Błąd: Konto już istnieje"
                });
            }

            const newUser = new User();
            newUser.email = email;
            newUser.firstName = firstName;
            newUser.lastName = lastName;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if(err)
                {
                    return res.end({
                        success: false,
                        message: "Błąd: Konto już istnieje"
                    });
                }

                return res.end({
                    success: true,
                    message: "Logowanie"
                });
            })
        });
    });

    app.post("/api/account/signin.js", (req, res, next) =>
    {
        const { body } = req;
        const {
            password,
        } = body;

        let { email } = body;

        if(!email)
        {
            return res.end({
                success: false,
                message: "Błąd: email nie może być pusty"
            });
        }
        if(!password)
        {
            return res.end({
                success: false,
                message: "Błąd: Hasło nie może być puste"
            });
        }

        email = email.toLowerCase();

        User.find({
            email: email
        }, (err, users) => {
            if(err)
            {
                return res.send({
                    success: false,
                    message: "Błąd: Błąd Serwera"
                });
            }

            if(users.length != 1)
            {
                return res.send({
                    success: false,
                    message: "Błąd: Nieważny"
                });
            }

            const user = users[0];
            if(!user.validPassword(password))
            {
                return res.send({
                    success: false,
                    message: "Błąd: Nieważny"
                });
            }

            //jeśli użytkownik jest poprawny
            var userSession = new userSession();
            userSession.userId = user._id;
            userSession.save( (err, doc) => {
                if(err)
                {
                    return res.send({
                        success: false,
                        message: "Błąd: Błąd Serwera"
                    });
                }
            });

            return res.send({
                success: true,
                message: "Zalogowano prawidłowo",
                token: doc._id
            });
        });
    });

    app.get("/api/account/logout.js", (req, res, next) => {
        //pobierz token
        const { query } = req;
        const { tkoen } = query;
        //?token=test

        //Sprawdź, czy token jest jedyny w swoim rodzaju i czy nie został usunięty
        UserSession.findOneOrUpdate({
            _id: token,
            isDeleted: false,
        }, {
             $set: {
                 isDeleted: true}
                ,
         }, null , (err, sessions) => {
            if(err)
            {
                return res.send({
                    success: false,
                    message: "Błąd: Błąd Serwera"
                });
            }

            if(sessions.length != 1)
            {
                return res.send({
                    success: false,
                    message: "Błąd: Nieważny"
                })
            }
            else
            {
                return res.send({
                    success: true,
                    message: "Dobry"
                })
            }
        });
    });
};
