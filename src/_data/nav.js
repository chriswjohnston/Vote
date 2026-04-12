module.exports = [
  {
    label: "About",
    url: "/about/",
    children: [
      { label: "About Me", url: "/about/" },
      { label: "My Record", url: "/about/record/" }
    ]
  },
  {
    label: "Priorities",
    url: "/priorities/",
    children: [
      { label: "Overview", url: "/priorities/" },
      { label: "Fiscal Responsibility", url: "/priorities/fiscal/" },
      { label: "Community Services", url: "/priorities/community-services/" },
      { label: "Communication & Technology", url: "/priorities/communication/" },
      {
        label: "Governance",
        url: "/priorities/governance/",
        children: [
          { label: "Overview", url: "/priorities/governance/" },
          { label: "The Law", url: "/priorities/governance/the-law/" },
          { label: "Board & Committee Direction", url: "/priorities/governance/board-direction/" },
          { label: "Why This Gets Inverted", url: "/priorities/governance/why-inverted/" },
          { label: "How I Would Fix It", url: "/priorities/governance/how-to-fix/" },
          {
            label: "Examples",
            children: [
              { label: "CAO Recruitment", url: "/priorities/governance/examples/cao-recruitment/" },
              { label: "Municipal Software", url: "/priorities/governance/examples/municipal-software/" },
              { label: "Landfill Card", url: "/priorities/governance/examples/landfill/" },
              { label: "Boards & By-Laws", url: "/priorities/governance/examples/boards-bylaws/" },
              { label: "Strategic Planning", url: "/priorities/governance/examples/strategic-planning/" }
            ]
          }
        ]
      }
    ]
  },
  {
    label: "My Plan",
    url: "/my-plan/",
    children: [
      { label: "I Didn't Wait to Start", url: "/my-plan/" },
      { label: "Archive Creation", url: "/my-plan/archive/" },
      { label: "Agenda Package", url: "/my-plan/agenda-package/" },
      { label: "Ombudsman Complaint", url: "/my-plan/ombudsman/" },
      { label: "Website Failures", url: "/my-plan/website-failures/" },
      { label: "Formal Landfill Request", url: "/my-plan/landfill-request/" },
      { label: "13-Point Plan", url: "/my-plan/13-point-plan/" }
    ]
  },
  {
    label: "Finances",
    url: "/finances/"
  },
  {
    label: "Contact",
    url: "/#contact"
  }
];
