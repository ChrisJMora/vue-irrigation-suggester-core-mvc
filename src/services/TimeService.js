export default {

    calculateEndTime(startTime, duration) {
        const startTimeParts = startTime.split(':');
        const durationParts = duration.split(':');
        const startHours = parseInt(startTimeParts[0]);
        const startMinutes = parseInt(startTimeParts[1]);
        const startSeconds = parseInt(startTimeParts[2]) || 0;
        const durationHours = parseInt(durationParts[0]);
        const durationMinutes = parseInt(durationParts[1]);
        const durationSeconds = parseInt(durationParts[2]) || 0;
    
        const totalSeconds = (startHours * 3600 + startMinutes * 60 + startSeconds) + (durationHours * 3600 + durationMinutes * 60 + durationSeconds);
        const endTimeHours = Math.floor(totalSeconds / 3600) % 24;
        const endTimeMinutes = Math.floor((totalSeconds % 3600) / 60);
        const endTimeSeconds = totalSeconds % 60;
    
        if (endTimeHours > 23 || (endTimeHours === 23 && endTimeMinutes > 0 && endTimeSeconds > 0)) {
            alert("El cronograma no cabe en el mismo día");
            return;
        }
    
        return `${endTimeHours.toString().padStart(2, '0')}:${endTimeMinutes.toString().padStart(2, '0')}:${endTimeSeconds.toString().padStart(2, '0')}`;
    },

    calculateDuration(startTime, endTime) {
        const startDate = new Date(`1970-01-01T${startTime}`);
        const endDate = new Date(`1970-01-01T${endTime}`);
        const differenceMS = endDate - startDate;   // milisegundos
        const hours = Math.floor(differenceMS / 3600000);
        const minutes = Math.floor((differenceMS % 3600000) / 60000);
        const seconds = Math.floor((differenceMS % 60000) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
  
  }