import { getUser, getUsers, addUser, deleteUser } from "../database/sql_DB.js";


const createAccount = async (req, res) => {
    // Create account logic
    try {
        const { username, email, password } = req.body;
        const { id } = parseInt(req.params);
        addUser.run(id, username, email, password, function (err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    console.log("Error: Duplicate primary key");
                    return res.status(400).send("Error: Duplicate primary key");
                } else {
                    console.log("Error in SQL: ", err);
                    return res.status(500).send("Error in SQL while creating account");
                }
            } else {
                console.log("User added successfully");
                return res.status(200).send("Account created successfully");
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating account");
    }
};


const getAccount = async (req, res) => {
    // Get account logic
    try {
        const { id } = parseInt(req.params);
        if (isNaN(id)) {
            res.status(400).send("Invalid ID");
        }

        getUser.get(id, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error getting account");
            }

            if (!user) {
                return res.status(404).send("Account not found");
            }

            console.log("Account found: ", user);
            res.status(200).send(user);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error getting account");
    }
}

const deleteAccount = async (req, res) => {
    // Delete account logic
    try {
        const { id } = req.params;

        getUser.get(id, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error in SQL while getting account inside DELETE");
            }

            if (!user) {
                return res.status(404).send("Account not found");
            }

            deleteUser.run(id, function (err) {
                if (err) {
                    console.log("Error in SQL while deleting account: ", err);
                    return res.status(500).send("Error in SQL while deleting account");
                }
                console.log("Account deleted successfully");
                return res.status(200).send("Account deleted successfully");
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting account");
    }
}

export { createAccount, getAccount, deleteAccount };