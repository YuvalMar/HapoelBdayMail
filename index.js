import { PASSWORD, USER, TO } from "./modules/consts.js";

import nodemailer from "nodemailer";
import cron from "node-cron";

const data = [
    { id: 7600, name: "Denis Polyakov", birthDay: "17.04.91" },
    { id: 26011, name: "Dino Štiglec", birthDay: "03.10.90" },
    { id: 19516, name: "Dor Malul", birthDay: "30.04.89" },
    { id: "21156", name: "Alon Turgeman", birthDay: "09.06.91" },
    { id: 68020, name: "Loai Taha", birthDay: "26.11.89" },
    { id: 28334, name: "Gal Arel", birthDay: "09.07.89" },
    { id: 28331, name: "Hanan Maman", birthDay: "28.08.89" },
    { id: 9189, name: "Ohad Levita", birthDay: "17.02.86" },
    { id: 16827, name: "Arvydas Novikovas", birthDay: "18.12.90" },
    { id: 28317, name: "Hatem Elhamid", birthDay: "18.03.91" },
    { id: 100930, name: "Shoval Gozlan", birthDay: "25.04.94" },
    { id: 97542, name: "Gidi Kanuk", birthDay: "11.02.93" },
    { id: 163328, name: "Carnejy Antoine", birthDay: "27.07.91" },
    { id: 235938, name: "Dudu Twitto", birthDay: "06.02.94" },
    { id: 194272, name: "Liran Sardal", birthDay: "02.07.94" },
    { id: 232915, name: "Oren Bitton", birthDay: "16.06.94" },
    { id: 52920, name: "Aleksandar Šćekić", birthDay: "12.12.91" },
    { id: 386778, name: "Eliel Peretz", birthDay: "18.11.96" },
    { id: 28342, name: "Ran Kadosh", birthDay: "04.10.85" },
    { id: 167519, name: "Costas Soteriou", birthDay: "21.06.96" },
    { id: 1111945, name: "Tomer Yossefi", birthDay: "02.02.99" },
    { id: 854721, name: "Dudu Altrovich", birthDay: "12.07.99" },
    { id: 460389, name: "Glezer Tamir Itzhak", birthDay: "30.05.00" },
    { id: 1249841, name: "Yarin Serdal", birthDay: "13.02.01" },
    { id: 1249457, name: "Amit Suari", birthDay: "20.04.01" },
    { id: 1256307, name: "Abed Elrauf Jabarin", birthDay: "22.01.02" },
    { id: 1165348, name: "Guy Mizrahi", birthDay: "30.03.01" },
    { id: 1260263, name: "Itay Buganim", birthDay: "29.05.01" },
    { id: 1111299, name: "Mohammed Kamara", birthDay: "31.10.97" },
    { id: 1331575, name: "Jabier Boshank", birthDay: "01.05.03" },
];

const sendEmail = async(subject, message) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: USER,
            pass: PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let mailOptions = {
        from: USER,
        to: TO,
        subject: subject,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
    } catch (error) {
        console.error(error);
    }
};

cron.schedule("0 12 * * *", function() {
    const today = new Date();

    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = Number("0" + dd);
    if (mm < 10) mm = "0" + mm;

    if (dd === 1) {
        const filteredPlayers = data.filter(
            (element) => element.birthDay.split(".")[1] === mm
        );
        filteredPlayers.sort((a, b) => {
            return (
                Number(a.birthDay.split(".")[0]) - Number(b.birthDay.split(".")[0])
            );
        });
        const playerStrings = filteredPlayers.map(
            (player) => `${player.name} ${player.birthDay}`
        );
        const longString = playerStrings.join("\n");

        sendEmail(`Hapoel b-day for month ${mm}`, longString);
    } else {
        const filteredPlayers = data.filter(
            (element) =>
            element.birthDay.split(".")[1] === mm &&
            Number(element.birthDay.split(".")[0]) === dd
        );
        if (filteredPlayers.length > 0) {
            filteredPlayers.sort((a, b) => {
                return (
                    Number(a.birthDay.split(".")[0]) - Number(b.birthDay.split(".")[0])
                );
            });
            const playerStrings = filteredPlayers.map(
                (player) => `${player.name} Has birthday today`
            );
            const longString = playerStrings.join("\n");
            sendEmail(`Hapoel b-day for today`, longString);
        }
    }
});