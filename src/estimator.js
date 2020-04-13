const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  let normalizedDays = 0;
  switch (data.periodType) {
    case 'days':
      normalizedDays = data.timeToElapse;
      break;
    case 'weeks':
      normalizedDays = data.timeToElapse * 7;
      break;
    case 'months':
      normalizedDays = data.timeToElapse * 30;
      break;
    default:
      break;
  }

  impact.currentlyInfected = data.reportedCases * 10;
  severeImpact.currentlyInfected = data.reportedCases * 50;
  impact.infectionsByRequestedTime = impact.currentlyInfected * Math.pow(2, Math.trunc(normalizedDays / 3));
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * Math.pow(2, Math.trunc(normalizedDays / 3));
  impact.severeCasesByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * .15);
  severeImpact.severeCasesByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime * .15);
  impact.hospitalBedsByRequestedTime = Math.trunc((data.totalHospitalBeds * .35) - impact.severeCasesByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = Math.trunc((data.totalHospitalBeds * .35) - severeImpact.severeCasesByRequestedTime);
  impact.casesForICUByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * .05);
  severeImpact.casesForICUByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime * .05);
  impact.casesForVentilatorsByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * .02);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime * .02);
  impact.dollarInFlight = impact.infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD * normalizedDays;
  severeImpact.dollarInFlight = severeImpact.infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD * normalizedDays;
};  

export default covid19ImpactEstimator;