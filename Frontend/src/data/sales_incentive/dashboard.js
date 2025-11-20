import {
  CircleCheckBig,
  LayoutList,
  ShoppingBag,
  Trophy,
  Truck,
} from "lucide-react";
import DashIcon from "../../assets/icons/Dashboard.png";
import RuleIcon from "../../assets/icons/Rules.png";
import ProcessIcon from "../../assets/icons/Process.png";
import ReportIcon from "../../assets/icons/Reports.png";
import NoticeIcon from "../../assets/icons/Notice.png";

export const SalesSidebarData = [
  {
    icon: DashIcon,
    title: "Dashboard",
    href: "#",
    sublinks: [
      {
        title: "User Management",
        href: "/salesincentive/usermanage",
      },
      {
        title: "Analytics",
        href: "/salesincentive/analytics",
      },
    ],
  },
  {
    icon: RuleIcon,
    title: "Rules",
    href: "#",
    sublinks: [
      {
        title: "Product Eligibility",
        href: "/salesincentive/producteligibility",
      },
      {
        title: "Slab levels",
        href: "/salesincentive/slablevel",
      },
      {
        title: "Payment Stages",
        href: "/salesincentive/paymentstages",
      },
      {
        title: "Exclusion Packages",
        href: "/salesincentive/exclusionpackages",
      },
      {
        title: "Bearer PCR",
        href: "/salesincentive/bearerpcr",
      },
      {
        title: "PEO Packages PCR",
        href: "/salesincentive/peopackages",
      },
      {
        title: "BB Packages PCR",
        href: "/salesincentive/bbpackages",
      },
      {
        title: "LTE BB Package",
        href: "/salesincentive/ltepackage",
      },
      {
        title: "LTE BB Package PCR",
        href: "/salesincentive/ltepackagepcr",
      },
      {
        title: "Voice Packages",
        href: "/salesincentive/unlimitedvoice",
      },
      {
        title: "Sales Data Availability",
        href: "/salesincentive/dataavailability",
      },
    ],
  },
  {
    icon: ProcessIcon,
    title: "Process Com",
    href: "#",
    sublinks: [
      {
        title: "New Cal Rule",
        href: "/salesincentive/newschema",
      },
      {
        title: "View Cal Rule",
        href: "/salesincentive/schema",
      },
      {
        title: "Incentive Calculation",
        href: "/salesincentive/calculation",
      },
    ],
  },
  {
    icon: ReportIcon,
    title: "Reports",
    href: "#",
    sublinks: [
      {
        title: "Calculation Reports",
        href: "/salesincentive/calculationreport",
      },
    ],
  },
  {
    icon: NoticeIcon,
    title: "Notice",
    href: "#",
    sublinks: [
      {
        title: "Promotion",
        href: "/dashboard",
      },
      {
        title: "Notifications",
        href: "/dashboard",
      },
    ],
  },
];

// dashboard analytics data
export const statisticsData = [
  {
    topic: "Total Commission",
    icon: ShoppingBag,
    count: 1235700,
    subTopic: "Accross all Sales Channels",
    increment: "2%",
    desc: "vs last period",
    color: "white",
  },
  {
    topic: "Total Sales Persons",
    icon: CircleCheckBig,
    count: 400,
    subTopic: "Including RTOMS",
    increment: "5%",
    desc: "vs last period",
    color: "red",
  },
  {
    topic: "Total PCR",
    icon: Truck,
    count: 143000,
    subTopic: "Without Slab Levels",
    increment: "2%",
    desc: "vs last period",
    color: "lightGreen",
  },
  {
    topic: "Total Active Sales",
    icon: Trophy,
    count: 85000,
    subTopic: "Distinct Bearer Types",
    increment: "10%",
    desc: "vs last period",
    color: "lightBlue",
  },
];
