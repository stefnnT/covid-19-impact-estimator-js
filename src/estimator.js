const normalizedDays = (periodType, periodCount) => {
  let days;
  switch (periodType) {
    case 'days':
      days = periodCount;
      break;
    case 'weeks':
      days = periodCount * 7;
      break;
    case 'months':
      days = periodCount * 30;
      break;
    default:
      break;
  }
  return days;
};

const ci = (reportedCases, severe = false) => {
  return !severe ? reportedCases * 10 : reportedCases * 50;
};

const ibrt = (currentlyInfected, days) => {
  return currentlyInfected * (2 ** Math.trunc(days / 3));
};

const scbrt = (ibrt) => {
  return Math.trunc(ibrt * 0.15);
};

const hbbrt = (thb, { severeCasesByRequestedTime }) => {
  return Math.trunc((thb * 0.35) - severeCasesByRequestedTime);
};

const cfibrt = ({ infectionsByRequestedTime }) => {
  return Math.trunc(infectionsByRequestedTime * 0.05);
};

const cfvbrt = ({ infectionsByRequestedTime }) => {
  return Math.trunc(infectionsByRequestedTime * 0.02);
};

const dif = ({ infectionsByRequestedTime }, { avgDailyIncomeInUSD, avgDailyIncomePopulation }, day) => {
  return infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD * day;
};

const estimator = (x) => {
  
};

const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  let days = normalizedDays(data.periodType, data.timeToElapse);
  
  impact.currentlyInfected = ci(data.reportedCases);
  severeImpact.currentlyInfected = ci(data.reportedCases, true);

  impact.infectionsByRequestedTime = ibrt(impact.currentlyInfected, days);
  severeImpact.infectionsByRequestedTime = ibrt(severeImpact.currentlyInfected, days);

  impact.severeCasesByRequestedTime = scbrt(impact.infectionsByRequestedTime);
  severeImpact.severeCasesByRequestedTime = scbrt(severeImpact.infectionsByRequestedTime);

  impact.hospitalBedsByRequestedTime = hbbrt(data.totalHospitalBeds, impact);
  severeImpact.hospitalBedsByRequestedTime = hbbrt(data.totalHospitalBeds, severeImpact);

  impact.casesForICUByRequestedTime = cfibrt(impact);
  severeImpact.casesForICUByRequestedTime = cfibrt(severeImpact);

  impact.casesForVentilatorsByRequestedTime = cfvbrt(impact);
  severeImpact.casesForVentilatorsByRequestedTime = cfvbrt(severeImpact);

  impact.dollarInFlight = dif(impact, data.region, days);
  severeImpact.dollarInFlight = dif(severe, data.region, days);
};  

export default covid19ImpactEstimator;