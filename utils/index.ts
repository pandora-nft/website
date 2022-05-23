import moment from "moment"

export const shortenAddress = (address: string) => {
  if (!address || address.length === 0) {
    return "0x000...00000"
  }
  return address.substring(0, 6) + "..." + address.substring(address.length - 6, address.length)
}

export const convertToCountdown = (drawTimestamp: number) => {
  const currentTime = new Date().getTime() / 1000
  var diffTime = drawTimestamp - currentTime
  var duration = moment.duration(diffTime * 1000, "milliseconds")

  let metric = ""
  let time = 0
  if (duration.months() > 0) {
    time = duration.months()
    metric = "month"
  } else if (duration.days() > 0) {
    time = duration.days()
    metric = "day"
  } else if (duration.hours() > 0) {
    time = duration.hours()
    metric = "hour"
  } else if (duration.minutes() > 0) {
    time = duration.minutes()
    metric = "hour"
  } else if (duration.seconds() > 0) {
    time = duration.seconds()
    metric = "second"
  } else {
    return "Ended"
  }

  if (time > 1) {
    metric += "s"
  }

  return time + " " + metric
}
