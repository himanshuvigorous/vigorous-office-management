
import { encrypt } from "../../config/Encryption";
import getUserIds from "../../constents/getUserIds";
export const sidebarMenu = [
  {
    title: "Dashboard",
    icon: "fa-solid fa-house",
    path: "dashboard",
    orderBy: 1,
    visible: true,
    role: ["admin", "company", "companyDirector", "companyBranch","employee" ],
  },
  {
    title: "My Profile",
    icon: "fa-solid fa-briefcase",
    path: `onBoarding/onBoardingView/${encrypt(getUserIds()?.useronboardingId)}`,
    orderBy: 1,
    visible: true,
    role: ["employee" ],
  },
  {
    title: "Organization Info",
    icon: "fa-solid fa-house",
    path: null,
    orderBy: 1,
    visible: true,
    role: ["admin",],
    submenu: [
      {
        title: "Company",
        icon: "fa-solid fa-building",
        path: "company",
        orderBy: 1,
        visible: true,
        role: ["admin"],
      },
    ]
  },
  {
    title: "Organization Info",
    icon: "fa-solid fa-house",
    path: null,
    orderBy: 1,
    visible: true,
    role: ["company"],
    submenu: [

      {
        title: "My Profile",
        icon: "fa-solid fa-briefcase",
        path: "my-company",
        orderBy: 1,
        visible: true,
        role: ["company"],
      },
      
      {
        title: "Owner Logins",
        icon: "fa-solid fa-user-tie",
        path: "director",
        orderBy: 1,
        visible: true,
        role: ["company"],
      },

      {
        title: "Branch",
        icon: "fa-solid fa-layer-group",
        path: "branch",
        orderBy: 1,
        visible: true,
        role: ["company", "companyDirector"],
      },

    ]
  },
  {
    title: "Organization Info",
    icon: "fa-solid fa-house",
    path: null,
    orderBy: 1,
    visible: true,
    role: ["companyDirector"],
    submenu: [

      {
        title: "My Company",
        icon: "fa-solid fa-briefcase",
        path:  `/admin/company/view/${encrypt(getUserIds()?.userCompanyId)}`,
        orderBy: 1,
        visible: true,
        role: ["companyDirector"],
      },
      {
        title: "My Profile",
        icon: "fa-solid fa-briefcase",
        path: "my-director",
        orderBy: 1,
        visible: true,
        role: ["companyDirector"],
      },
      {
        title: "Branch",
        icon: "fa-solid fa-layer-group",
        path: "branch",
        orderBy: 1,
        visible: true,
        role: ["company", "companyDirector"],
      },
    ]
  },
  {
    title: "Organization Info",
    icon: "fa-solid fa-house",
    path: null,
    orderBy: 1,
    visible: true,
    role: ["companyBranch"],
    submenu: [
      {
        title: "My Profile",
        icon: "fa-solid fa-briefcase",
        path: "my-branch",
        orderBy: 1,
        visible: true,
        role: ["companyBranch"],
      },
    ]
  },
  {
    title: "Sidebar",
    icon: "fa-solid fa-briefcase",
    path: "dynamic-sidebar",
    orderBy: 1,
    visible: true,
    role: ["admin"],
  },

  {
    "title": "Master",
    "icon": "fas fa-cogs",
    "path": null,
    "orderBy": 1,
    "submenu": [
      {
        "title": "Other Settings",
        "icon": "fas fa-cogs",
        "path": null,
        "orderBy": 1,
        "visible": true,
        "submenu": [
          {
            "title": "Plan Management",
            "icon": "fas fa-calendar-alt",
            "path": "plan",
            "orderBy": 1,
            "visible": true,
            "role": ["admin"]
          },
          {
            "title": "Add Bank",
            "icon": "fas fa-calendar-alt",
            "path": "/admin/bankname",
            "orderBy": 1,
            "visible": true,
            "role": ["admin"]
          },
          {
            "title": "Document Type",
            "icon": "fas fa-file-alt",
            "path": "document-type",
            "orderBy": 1,
            "visible": true,
            "role": ["admin",]
          },
          {
            "title": "Organization Type",
            "icon": "fas fa-building",
            "path": "organization-type",
            "orderBy": 1,
            "visible": true,
            "role": ["admin",]
          },
          {
            "title": "Industry Type",
            "icon": "fas fa-industry",
            "path": "industry",
            "orderBy": 1,
            "visible": true,
            "role": ["admin",]
          },
          {
            "title": "Support",
            "icon": "fas fa-map-marker-alt",
            "path": 'support-list',
           
            "orderBy": 1,
            "visible": true,
            "role": ["admin",]
          }
        ],
        "role": ["admin",]
      },
      {
        "title": "Address Setting",
        "icon": "fas fa-map-marker-alt",
        "path": null,
        "submenu": [
          {
            "title": "Country",
            "icon": "fas fa-flag",
            "path": "country",
            "orderBy": 1,
            "visible": true,
            "role": ["admin",]
          },
          {
            "title": "State",
            "icon": "fas fa-map-signs",
            "path": "state",
            "orderBy": 1,
            "visible": true,
            "role": ["admin",]
          },
          {
            "title": "City",
            "icon": "fas fa-city",
            "path": "city",
            "orderBy": 1,
            "visible": true,
            "role": ["admin",]
          }
        ],
        "orderBy": 1,
        "visible": true,
        "role": ["admin",]
      }
      
      
    ],
    "visible": true,
    "role": ["admin",]
  }


];
