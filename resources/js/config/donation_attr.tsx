import donation_data from "./donation_data";
import initiator_data from "./initiator_data";


const startDate = new Date("2025-03-01");
const finishDate = new Date("2025-06-01");
const msPerDay = 24 * 60 * 60 * 1000;
let totalDonation = 0;
const donationLimit = initiator_data[0].donationLimit;
let totalUserDonate = donation_data.length;

const totalDays = Math.floor((finishDate.getTime() - startDate.getTime()) / msPerDay);
const currentDate = new Date();
const elapsedDays = Math.floor((currentDate.getTime() - startDate.getTime()) / msPerDay);

const progressCompleted = Math.max(0, Math.min(elapsedDays, totalDays));
for (let i = 0; i < donation_data.length; i++) {

    totalDonation += donation_data[i].amount;

}

export { totalDonation, totalUserDonate, progressCompleted, totalDays, donationLimit, initiator_data, donation_data };
