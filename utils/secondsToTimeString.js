export const secondsToTimeString = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const secs = (seconds - hours * 3600 - minutes * 60).toFixed(2);
    return `${hours}h:${minutes}m:${secs}s`;
}