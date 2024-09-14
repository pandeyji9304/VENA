import Apppointment from "../models/Appointment.js";

export const calculateTimeSlots = async (doctor, date) => {
  let timeSlots = [];
  const requestedDate = new Date(date);

  if (doctor.schedule === "EVERY_DAY" || doctor.schedule === "MON_SAT") {
    const workingHours = doctor.workingHours.find(
      (day) =>
        day.day ===
        requestedDate
          .toLocaleDateString("en-US", { weekday: "long" })
          .toUpperCase()
    );
    console.log("workingHours", workingHours);

    if (workingHours) {
      let startTime = new Date(
        requestedDate.getFullYear(),
        requestedDate.getMonth(),
        requestedDate.getDate(),
        parseInt(workingHours.workingHours.from.split(":")[0]),
        parseInt(workingHours.workingHours.from.split(":")[1])
      );
      const endTime = new Date(
        requestedDate.getFullYear(),
        requestedDate.getMonth(),
        requestedDate.getDate(),
        parseInt(workingHours.workingHours.to.split(":")[0]),
        parseInt(workingHours.workingHours.to.split(":")[1])
      );
      console.log("Start time ", startTime);
      console.log("End time ", endTime);

      while (startTime < endTime) {
        const slot = {
          from: startTime.toISOString(),
          to: new Date(
            startTime.getTime() + doctor.duration * 60000
          ).toISOString(),
          date: new Date(
            requestedDate.getFullYear(),
            requestedDate.getMonth(),
            requestedDate.getDate()
          ).toISOString(),
          isBooked: false,
        };

        const isBooked = await Apppointment.exists({
          doctorId: doctor._id,
          dateAndTime: {
            $gt: startTime.toISOString(),
            $lt: new Date(
              startTime.getTime() + doctor.duration * 60000
            ).toISOString(),
          },
        });

        slot.isBooked = isBooked ?? false;
        timeSlots.push(slot);
        startTime = new Date(startTime.getTime() + doctor.duration * 60000);
      }
    }
  }

  return timeSlots;
};
