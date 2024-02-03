// ! apexChart.js ! //

// ? sale Chart
var options = {
  chart: {
    type: "area",
    toolbar: {
      show: false,
    },
    fontFamily: "vazir",
    height: "400px",
    width: "100%",
  },
  series: [
    {
      name: "فروش در ماه های گذشته",
      data: [
        1000, 2000, 3000, 2100, 5000, 4300, 3289, 2323, 1243, 8574, 3132, 1000,
      ],
    },
  ],
  xaxis: {
    categories: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
  },
  dataLabels: {
    style: {
      colors: ["#008FFB"],
      fontSize: "11px",
    },
  },
  theme: {
    palette: "palette1",
    monochrome: {
      enabled: true,
      color: "#008FFB",
    },
  },
};
var saleChart = new ApexCharts(document.querySelector("#sale-chart"), options);
saleChart.render();
// ? sale Chart

// ? revanue Chart
var options = {
  chart: {
    type: "area",
    toolbar: {
      show: false,
    },
    fontFamily: "vazir",
    height: "400px",
    width: "100%",
  },
  series: [
    {
      name: "درآمد در ماه های گذشته",
      data: [500, 700, 900, 1100, 780, 647, 1200, 960, 2500, 1000, 4000, 700],
    },
  ],
  xaxis: {
    categories: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
  },
  dataLabels: {
    style: {
      colors: ["#4CAF50"],
      fontSize: "11px",
    },
  },
  theme: {
    palette: "palette2",
    monochrome: {
      enabled: true,
      color: "#4CAF50",
    },
  },
};
var revanueChart = new ApexCharts(
  document.querySelector("#revanue-chart"),
  options
);
revanueChart.render();
// ? revanue Chart

// ? cost Chart
var options = {
  chart: {
    type: "area",
    toolbar: {
      show: false,
    },
    fontFamily: "vazir",
    height: "400px",
    width: "100%",
  },
  series: [
    {
      name: "هزینه در ماه های گذشته",
      data: [100, 300, 500, 760, 1000, 746, 948, 354, 1245, 650, 1345, 647],
    },
  ],
  xaxis: {
    categories: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
  },
  dataLabels: {
    style: {
      colors: ["#EA3546"],
      fontSize: "11px",
    },
  },
  theme: {
    palette: "palette6",
    monochrome: {
      enabled: true,
      color: "#EA3546",
    },
  },
};
var costChart = new ApexCharts(document.querySelector("#cost-chart"), options);
costChart.render();
// ? cost Chart

// ! apexChart.js ! //

var swiper = new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    // dynamicBullets: true,
  },
});
