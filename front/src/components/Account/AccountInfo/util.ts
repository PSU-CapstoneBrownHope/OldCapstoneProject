export interface IAccountFields {
  name: string,
  label: string,
  type: string,
  pattern?: string,
  options?: string[],
  value: any,
}

function getUsername() {
  return sessionStorage.getItem('username');
}

export const accountFields: IAccountFields[] = [ 
  {
    name: "userName",
    label: "User Name",
    type: "text",
    value: getUsername()
  },
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    value: ""
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    value: ""
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    value: ""
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "tel",
    pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}]",
    value: ""
  },
  {
    name: "emailAddress",
    label: "Email Address",
    type: "email",
    value: ""
  },
  {
    name: "contactMethod",
    label: "Contact Method",
    type: "select",
    options: ["Email", "Text", "Phone call"],
    value: ""
  },
  {
    name: "paymentMethod",
    label: "Payment Method",
    type: "select",
    options: ["online", "check"],
    value: ""
  }
]