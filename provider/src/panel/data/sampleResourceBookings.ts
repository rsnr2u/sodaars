import { BookingRecord } from '../types/booking';

export interface ResourceBookingInterval {
  id: string;
  resourceId: string;
  clientName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

// Baseline sample bookings for realistic October - November 2026 demonstration
export const BASELINE_RESOURCE_BOOKINGS: ResourceBookingInterval[] = [
  {
    "id": "bkg-seed-1",
    "resourceId": "res-mum-hoard-001",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-3",
    "resourceId": "res-mum-hoard-003",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-4",
    "resourceId": "res-mum-hoard-004",
    "clientName": "HDFC Bank Home Loans",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-6",
    "resourceId": "res-mum-hoard-006",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-7",
    "resourceId": "res-mum-hoard-007",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-9",
    "resourceId": "res-mum-hoard-009",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-10",
    "resourceId": "res-mum-hoard-010",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-13",
    "resourceId": "res-gur-hoard-013",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-15",
    "resourceId": "res-noi-hoard-015",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-16",
    "resourceId": "res-new-hoard-016",
    "clientName": "Amul Fresh Products Dairy",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-18",
    "resourceId": "res-new-hoard-018",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-19",
    "resourceId": "res-ben-hoard-019",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-21",
    "resourceId": "res-ben-hoard-021",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-22",
    "resourceId": "res-ben-hoard-022",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-27",
    "resourceId": "res-hyd-hoard-027",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-28",
    "resourceId": "res-hyd-hoard-028",
    "clientName": "OnePlus India Flagship Launch",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-30",
    "resourceId": "res-hyd-hoard-030",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-31",
    "resourceId": "res-che-hoard-031",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-33",
    "resourceId": "res-che-hoard-033",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-34",
    "resourceId": "res-che-hoard-034",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-37",
    "resourceId": "res-pun-hoard-037",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-39",
    "resourceId": "res-pun-hoard-039",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-40",
    "resourceId": "res-ahm-hoard-040",
    "clientName": "Cadbury Celebrations Festive",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-42",
    "resourceId": "res-ahm-hoard-042",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-43",
    "resourceId": "res-kol-hoard-043",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-45",
    "resourceId": "res-kol-hoard-045",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-46",
    "resourceId": "res-kol-hoard-046",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-49",
    "resourceId": "res-mum-hoard-049",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-51",
    "resourceId": "res-mum-hoard-051",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-52",
    "resourceId": "res-mum-hoard-052",
    "clientName": "HDFC Bank Home Loans",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-54",
    "resourceId": "res-mum-hoard-054",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-55",
    "resourceId": "res-mum-hoard-055",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-57",
    "resourceId": "res-new-hoard-057",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-58",
    "resourceId": "res-gur-hoard-058",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-61",
    "resourceId": "res-noi-bill-061",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-63",
    "resourceId": "res-new-bill-063",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-64",
    "resourceId": "res-new-bill-064",
    "clientName": "Amul Fresh Products Dairy",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-66",
    "resourceId": "res-ben-bill-066",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-67",
    "resourceId": "res-ben-bill-067",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-69",
    "resourceId": "res-ben-bill-069",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-70",
    "resourceId": "res-ben-bill-070",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-73",
    "resourceId": "res-hyd-bill-073",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-76",
    "resourceId": "res-hyd-bill-076",
    "clientName": "OnePlus India Flagship Launch",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-78",
    "resourceId": "res-che-bill-078",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-79",
    "resourceId": "res-che-bill-079",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-81",
    "resourceId": "res-pun-bill-081",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-82",
    "resourceId": "res-pun-bill-082",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-85",
    "resourceId": "res-pun-bill-085",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-87",
    "resourceId": "res-ahm-bill-087",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-88",
    "resourceId": "res-ahm-bill-088",
    "clientName": "Cadbury Celebrations Festive",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-90",
    "resourceId": "res-kol-bill-090",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-91",
    "resourceId": "res-kol-bill-091",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-93",
    "resourceId": "res-mum-bill-093",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-94",
    "resourceId": "res-mum-bill-094",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-97",
    "resourceId": "res-mum-bill-097",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-99",
    "resourceId": "res-mum-bill-099",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-102",
    "resourceId": "res-mum-bill-102",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-103",
    "resourceId": "res-new-bill-103",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-105",
    "resourceId": "res-gur-bill-105",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-106",
    "resourceId": "res-noi-bill-106",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-109",
    "resourceId": "res-new-bill-109",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-111",
    "resourceId": "res-ben-bill-111",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-112",
    "resourceId": "res-ben-bill-112",
    "clientName": "Amul Fresh Products Dairy",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-114",
    "resourceId": "res-ben-bill-114",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-115",
    "resourceId": "res-ben-bill-115",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-117",
    "resourceId": "res-ben-bill-117",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-118",
    "resourceId": "res-hyd-bill-118",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-121",
    "resourceId": "res-hyd-uni-121",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-123",
    "resourceId": "res-che-uni-123",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-124",
    "resourceId": "res-che-uni-124",
    "clientName": "OnePlus India Flagship Launch",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-126",
    "resourceId": "res-che-uni-126",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-127",
    "resourceId": "res-pun-uni-127",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-129",
    "resourceId": "res-pun-uni-129",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-130",
    "resourceId": "res-pun-uni-130",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-133",
    "resourceId": "res-ahm-uni-133",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-135",
    "resourceId": "res-kol-uni-135",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-136",
    "resourceId": "res-kol-uni-136",
    "clientName": "Cadbury Celebrations Festive",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-138",
    "resourceId": "res-kol-uni-138",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-139",
    "resourceId": "res-mum-uni-139",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-141",
    "resourceId": "res-mum-uni-141",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-142",
    "resourceId": "res-mum-uni-142",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-145",
    "resourceId": "res-mum-uni-145",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-147",
    "resourceId": "res-mum-uni-147",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-148",
    "resourceId": "res-mum-uni-148",
    "clientName": "HDFC Bank Home Loans",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-151",
    "resourceId": "res-gur-uni-151",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-153",
    "resourceId": "res-noi-uni-153",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-154",
    "resourceId": "res-new-uni-154",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-157",
    "resourceId": "res-ben-uni-157",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-159",
    "resourceId": "res-ben-uni-159",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-160",
    "resourceId": "res-ben-uni-160",
    "clientName": "Amul Fresh Products Dairy",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-162",
    "resourceId": "res-ben-uni-162",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-163",
    "resourceId": "res-ben-uni-163",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-165",
    "resourceId": "res-hyd-uni-165",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-166",
    "resourceId": "res-hyd-uni-166",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-169",
    "resourceId": "res-che-uni-169",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-171",
    "resourceId": "res-che-gan-171",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-172",
    "resourceId": "res-che-gan-172",
    "clientName": "OnePlus India Flagship Launch",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-174",
    "resourceId": "res-pun-gan-174",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-177",
    "resourceId": "res-pun-gan-177",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-178",
    "resourceId": "res-ahm-gan-178",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-181",
    "resourceId": "res-kol-gan-181",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-183",
    "resourceId": "res-kol-gan-183",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-184",
    "resourceId": "res-kol-gan-184",
    "clientName": "Cadbury Celebrations Festive",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-186",
    "resourceId": "res-mum-gan-186",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-187",
    "resourceId": "res-mum-gan-187",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-189",
    "resourceId": "res-mum-gan-189",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-190",
    "resourceId": "res-mum-gan-190",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-193",
    "resourceId": "res-mum-gan-193",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-195",
    "resourceId": "res-new-gan-195",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-196",
    "resourceId": "res-gur-gan-196",
    "clientName": "HDFC Bank Home Loans",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-198",
    "resourceId": "res-noi-gan-198",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-199",
    "resourceId": "res-noi-gan-199",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-201",
    "resourceId": "res-new-gan-201",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-202",
    "resourceId": "res-new-gan-202",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-205",
    "resourceId": "res-ben-gan-205",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-207",
    "resourceId": "res-ben-gan-207",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-208",
    "resourceId": "res-ben-gan-208",
    "clientName": "Amul Fresh Products Dairy",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-210",
    "resourceId": "res-hyd-gan-210",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-211",
    "resourceId": "res-hyd-gan-211",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-213",
    "resourceId": "res-hyd-gan-213",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-214",
    "resourceId": "res-hyd-gan-214",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-217",
    "resourceId": "res-che-bqs-217",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-219",
    "resourceId": "res-pun-bqs-219",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-220",
    "resourceId": "res-pun-bqs-220",
    "clientName": "OnePlus India Flagship Launch",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-222",
    "resourceId": "res-pun-bqs-222",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-223",
    "resourceId": "res-pun-bqs-223",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-226",
    "resourceId": "res-ahm-bqs-226",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-229",
    "resourceId": "res-kol-bqs-229",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-231",
    "resourceId": "res-mum-bqs-231",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-232",
    "resourceId": "res-mum-bqs-232",
    "clientName": "Cadbury Celebrations Festive",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-234",
    "resourceId": "res-mum-bqs-234",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-235",
    "resourceId": "res-mum-bqs-235",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-237",
    "resourceId": "res-mum-bqs-237",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-238",
    "resourceId": "res-mum-bqs-238",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-241",
    "resourceId": "res-new-bqs-241",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-243",
    "resourceId": "res-gur-bqs-243",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-244",
    "resourceId": "res-noi-bqs-244",
    "clientName": "HDFC Bank Home Loans",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-246",
    "resourceId": "res-new-bqs-246",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-247",
    "resourceId": "res-new-bqs-247",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-249",
    "resourceId": "res-ben-bqs-249",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-253",
    "resourceId": "res-ben-bqs-253",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-255",
    "resourceId": "res-ben-bqs-255",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-256",
    "resourceId": "res-hyd-bqs-256",
    "clientName": "Amul Fresh Products Dairy",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-258",
    "resourceId": "res-hyd-bqs-258",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-259",
    "resourceId": "res-hyd-bqs-259",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-261",
    "resourceId": "res-che-bqs-261",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-262",
    "resourceId": "res-che-bqs-262",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-265",
    "resourceId": "res-pun-bqs-265",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-267",
    "resourceId": "res-pun-pole-267",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-268",
    "resourceId": "res-pun-pole-268",
    "clientName": "OnePlus India Flagship Launch",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-270",
    "resourceId": "res-ahm-pole-270",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-271",
    "resourceId": "res-ahm-pole-271",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-273",
    "resourceId": "res-kol-pole-273",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-274",
    "resourceId": "res-kol-pole-274",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-277",
    "resourceId": "res-mum-pole-277",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-279",
    "resourceId": "res-mum-pole-279",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-280",
    "resourceId": "res-mum-pole-280",
    "clientName": "Cadbury Celebrations Festive",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-282",
    "resourceId": "res-mum-pole-282",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-283",
    "resourceId": "res-mum-pole-283",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-285",
    "resourceId": "res-mum-pole-285",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-286",
    "resourceId": "res-mum-pole-286",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-289",
    "resourceId": "res-gur-pole-289",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-291",
    "resourceId": "res-noi-pole-291",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-292",
    "resourceId": "res-new-pole-292",
    "clientName": "HDFC Bank Home Loans",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-294",
    "resourceId": "res-new-pole-294",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-295",
    "resourceId": "res-ben-pole-295",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-297",
    "resourceId": "res-ben-pole-297",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-298",
    "resourceId": "res-ben-pole-298",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-301",
    "resourceId": "res-ben-pole-301",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-303",
    "resourceId": "res-hyd-pole-303",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-304",
    "resourceId": "res-hyd-pole-304",
    "clientName": "Amul Fresh Products Dairy",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-306",
    "resourceId": "res-hyd-pole-306",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-307",
    "resourceId": "res-che-pole-307",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-309",
    "resourceId": "res-che-pole-309",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-310",
    "resourceId": "res-che-pole-310",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-313",
    "resourceId": "res-pun-wall-313",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-315",
    "resourceId": "res-pun-wall-315",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-316",
    "resourceId": "res-ahm-wall-316",
    "clientName": "OnePlus India Flagship Launch",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-318",
    "resourceId": "res-ahm-wall-318",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-319",
    "resourceId": "res-kol-wall-319",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-321",
    "resourceId": "res-kol-wall-321",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-322",
    "resourceId": "res-kol-wall-322",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-327",
    "resourceId": "res-mum-wall-327",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-328",
    "resourceId": "res-mum-wall-328",
    "clientName": "Cadbury Celebrations Festive",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-330",
    "resourceId": "res-mum-wall-330",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-331",
    "resourceId": "res-mum-wall-331",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-333",
    "resourceId": "res-new-wall-333",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-334",
    "resourceId": "res-gur-wall-334",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-337",
    "resourceId": "res-noi-wall-337",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-339",
    "resourceId": "res-new-wall-339",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-340",
    "resourceId": "res-new-wall-340",
    "clientName": "HDFC Bank Home Loans",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-342",
    "resourceId": "res-ben-wall-342",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-343",
    "resourceId": "res-ben-wall-343",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-345",
    "resourceId": "res-ben-wall-345",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-346",
    "resourceId": "res-ben-wall-346",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-349",
    "resourceId": "res-hyd-wall-349",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-351",
    "resourceId": "res-hyd-roof-351",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-352",
    "resourceId": "res-hyd-roof-352",
    "clientName": "Amul Fresh Products Dairy",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-354",
    "resourceId": "res-che-roof-354",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-355",
    "resourceId": "res-che-roof-355",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-357",
    "resourceId": "res-pun-roof-357",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-358",
    "resourceId": "res-pun-roof-358",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-361",
    "resourceId": "res-pun-roof-361",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-363",
    "resourceId": "res-ahm-roof-363",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-364",
    "resourceId": "res-ahm-roof-364",
    "clientName": "OnePlus India Flagship Launch",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-366",
    "resourceId": "res-kol-roof-366",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-367",
    "resourceId": "res-kol-roof-367",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-369",
    "resourceId": "res-mum-roof-369",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-370",
    "resourceId": "res-mum-roof-370",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-373",
    "resourceId": "res-mum-roof-373",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-376",
    "resourceId": "res-mum-roof-376",
    "clientName": "Cadbury Celebrations Festive",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-378",
    "resourceId": "res-mum-roof-378",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-379",
    "resourceId": "res-new-roof-379",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-381",
    "resourceId": "res-gur-roof-381",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-382",
    "resourceId": "res-noi-roof-382",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-385",
    "resourceId": "res-new-roof-385",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-387",
    "resourceId": "res-ben-roof-387",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-388",
    "resourceId": "res-ben-roof-388",
    "clientName": "HDFC Bank Home Loans",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-390",
    "resourceId": "res-ben-roof-390",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-391",
    "resourceId": "res-ben-brg-391",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-393",
    "resourceId": "res-ben-brg-393",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-394",
    "resourceId": "res-hyd-brg-394",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-397",
    "resourceId": "res-hyd-brg-397",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-399",
    "resourceId": "res-che-brg-399",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-402",
    "resourceId": "res-che-brg-402",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-403",
    "resourceId": "res-pun-brg-403",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-405",
    "resourceId": "res-pun-brg-405",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-406",
    "resourceId": "res-pun-brg-406",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-409",
    "resourceId": "res-ahm-brg-409",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-411",
    "resourceId": "res-kol-brg-411",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-412",
    "resourceId": "res-kol-brg-412",
    "clientName": "OnePlus India Flagship Launch",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-414",
    "resourceId": "res-kol-brg-414",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-415",
    "resourceId": "res-mum-brg-415",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-417",
    "resourceId": "res-mum-brg-417",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-418",
    "resourceId": "res-mum-brg-418",
    "clientName": "Samsung India Electronics",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-421",
    "resourceId": "res-mum-brg-421",
    "clientName": "Reliance Jio 5G Unlimited",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-423",
    "resourceId": "res-mum-brg-423",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-424",
    "resourceId": "res-mum-brg-424",
    "clientName": "Cadbury Celebrations Festive",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-426",
    "resourceId": "res-gur-stat-426",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-427",
    "resourceId": "res-gur-stat-427",
    "clientName": "Zomato Food Express",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-429",
    "resourceId": "res-noi-stat-429",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-430",
    "resourceId": "res-new-stat-430",
    "clientName": "Tanishq Festive Collection",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-433",
    "resourceId": "res-ben-stat-433",
    "clientName": "Tata Motors Passenger Vehicles",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-435",
    "resourceId": "res-ben-stat-435",
    "clientName": "Kalyan Jewellers Commercial",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-436",
    "resourceId": "res-ben-stat-436",
    "clientName": "HDFC Bank Home Loans",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-438",
    "resourceId": "res-ben-stat-438",
    "clientName": "Titan Watch Retail Campaign",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-439",
    "resourceId": "res-ben-stat-439",
    "clientName": "Amazon Prime Video Originals",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-441",
    "resourceId": "res-hyd-stat-441",
    "clientName": "Maruti Suzuki Arena Network",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-442",
    "resourceId": "res-hyd-stat-442",
    "clientName": "Asian Paints Royale Glitz",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-445",
    "resourceId": "res-che-stat-445",
    "clientName": "Flipkart Big Billion Days",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  },
  {
    "id": "bkg-seed-447",
    "resourceId": "res-che-stat-447",
    "clientName": "LIC of India Public Offer",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31"
  },
  {
    "id": "bkg-seed-448",
    "resourceId": "res-che-stat-448",
    "clientName": "Amul Fresh Products Dairy",
    "startDate": "2026-10-01",
    "endDate": "2026-10-18"
  }
];

export interface OccupationCalculationResult {
  totalDays: number;
  bookedDays: number;
  freeDays: number;
  occupancyPercent: number;
  status: 'AVAILABLE' | 'PARTIALLY_OCCUPIED' | 'FULLY_OCCUPIED';
  colorConfig: {
    barBg: string;
    text: string;
    bg: string;
    border: string;
    label: string;
    tier: 'danger' | 'warning' | 'success' | 'available';
  };
  freeSlotHint: string;
}

/**
 * Calculates occupation details for a specific resource over a given date range [startDate, endDate].
 * Respects:
 * - Danger color under 30%
 * - Warning color between 30% and 99%
 * - Success color at 100%
 */
export function calculateResourceOccupation(
  resourceId: string,
  startDateStr: string,
  endDateStr: string,
  extraBookings: BookingRecord[] = []
): OccupationCalculationResult {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const diffTime = end.getTime() - start.getTime();
  const totalDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

  // Combine baseline seed bookings with provider-created bookings from storage
  const allIntervals: { start: Date; end: Date; client?: string }[] = [];

  BASELINE_RESOURCE_BOOKINGS.filter((b) => b.resourceId === resourceId).forEach((b) => {
    allIntervals.push({
      start: new Date(b.startDate),
      end: new Date(b.endDate),
      client: b.clientName,
    });
  });

  extraBookings
    .filter((b) => b.resourceId === resourceId && b.status !== 'CANCELLED' && b.status !== 'DECLINED')
    .forEach((b) => {
      allIntervals.push({
        start: new Date(b.startDate),
        end: new Date(b.endDate),
        client: b.companyName,
      });
    });

  // Calculate day-by-day booked mask within [start, end]
  let bookedDays = 0;
  const cursor = new Date(start);
  const bookedSet = new Set<string>();

  while (cursor <= end) {
    const curTime = cursor.getTime();
    const curIso = cursor.toISOString().split('T')[0];

    const isBooked = allIntervals.some((interval) => {
      return curTime >= interval.start.getTime() && curTime <= interval.end.getTime();
    });

    if (isBooked) {
      bookedDays += 1;
      bookedSet.add(curIso);
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  const freeDays = Math.max(0, totalDays - bookedDays);
  const occupancyPercent = Math.min(100, Math.round((bookedDays / totalDays) * 100));

  let status: 'AVAILABLE' | 'PARTIALLY_OCCUPIED' | 'FULLY_OCCUPIED' = 'AVAILABLE';
  if (bookedDays === 0) {
    status = 'AVAILABLE';
  } else if (bookedDays >= totalDays) {
    status = 'FULLY_OCCUPIED';
  } else {
    status = 'PARTIALLY_OCCUPIED';
  }

  // Color rules per user requirements:
  // - under 30%: danger color (rose-500)
  // - above 30% and below 100%: warning color (amber-500)
  // - 100%: success color (emerald-600)
  let colorConfig: OccupationCalculationResult['colorConfig'];

  if (occupancyPercent === 100) {
    colorConfig = {
      barBg: 'bg-emerald-600',
      text: 'text-emerald-800',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      label: '100% Booked',
      tier: 'success',
    };
  } else if (occupancyPercent >= 30) {
    colorConfig = {
      barBg: 'bg-amber-500',
      text: 'text-amber-800',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      label: `${occupancyPercent}% Booked`,
      tier: 'warning',
    };
  } else if (occupancyPercent > 0) {
    colorConfig = {
      barBg: 'bg-rose-500',
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      label: `${occupancyPercent}% Booked`,
      tier: 'danger',
    };
  } else {
    colorConfig = {
      barBg: 'bg-[#E5E5E5]',
      text: 'text-emerald-800',
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      label: 'Available',
      tier: 'available',
    };
  }

  // Next slot hint
  let freeSlotHint = '100% Free for Period';
  if (status === 'FULLY_OCCUPIED') {
    const endNext = new Date(end);
    endNext.setDate(endNext.getDate() + 1);
    const dayStr = endNext.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    freeSlotHint = `Booked through ${end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • Next free ${dayStr}`;
  } else if (status === 'PARTIALLY_OCCUPIED') {
    // Find the first free date block
    const scan = new Date(start);
    let firstFree = null;
    while (scan <= end) {
      const iso = scan.toISOString().split('T')[0];
      if (!bookedSet.has(iso)) {
        firstFree = new Date(scan);
        break;
      }
      scan.setDate(scan.getDate() + 1);
    }

    if (firstFree) {
      const freeStr = firstFree.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      freeSlotHint = `Free from ${freeStr} (${freeDays} days open to sell)`;
    } else {
      freeSlotHint = `${freeDays} days open to sell`;
    }
  }

  return {
    totalDays,
    bookedDays,
    freeDays,
    occupancyPercent,
    status,
    colorConfig,
    freeSlotHint,
  };
}
