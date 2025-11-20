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
export const dealerSideBarData = [
  {
    icon: DashIcon,
    title: "Dashboard",
    href: "#",
    sublinks: [
      {
        title: "Analytics",
        href: "/dealer/analytics",
      },
      {
        title: "User Management",
        href: "/dealer/usermanagement",
      },
    ],
  },
  {
    icon: RuleIcon,
    title: "Rules",
    href: "#",
    sublinks: [
      {
        title: "Service Order Type",
        href: "/dealer/servicetype", //new
      },
      {
        title: "Slab Demarcation",
        href: "/dealer/slabdema",
      },
      {
        title: "Bearer Rate",
        href: "/dealer/bearerrate",
      },
      {
        title: "Black List",
        href: "/dealer/blacklist",
      },
      {
        title: "Package Rate",
        href: "/dealer/packagerate",
      },
    ],
  },
  {
    icon: ProcessIcon,
    title: "Process Com",
    href: "#",
    sublinks: [],
  },
  {
    icon: ReportIcon,
    title: "Reports",
    href: "#",
    sublinks: [

      {
        title: "Monthly Summary Report",
        href: "/dealer/monthlysummary",
      },
      {
        title: "Cumulative Summary Report",
        href: "/dealer/commissionsummary",
      },
      {
        title: "Sales Count Report",
        href: "/dealer/summaryreports",
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
        href: "#",
      },
      {
        title: "Notifications",
        href: "#",
      },
    ],
  },
];

// dashboard analytics data
export const statisticsData = [
  {
    topic: "Total Products",
    icon: ShoppingBag,
    count: 700,
    subTopic: "Accross all categories",
    increment: "2%",
    desc: "vs last period",
    color: "white",
  },
  {
    topic: "Active Products",
    icon: CircleCheckBig,
    count: 400,
    subTopic: "71% of total products",
    increment: "5%",
    desc: "vs last period",
    color: "red",
  },
  {
    topic: "Service Types",
    icon: Truck,
    count: 30,
    subTopic: "Dealer,Direct or Freeshiping",
    increment: "2%",
    desc: "vs last period",
    color: "lightGreen",
  },
  {
    topic: "Avg.Success Rates",
    icon: Trophy,
    count: 10,
    subTopic: "Based on eligibility",
    increment: "10%",
    desc: "vs last period",
    color: "lightBlue",
  },
];
