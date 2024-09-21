// bg-blue-950 border-blue-950
// bg-zinc-900 border-zinc-900
// bg-rose-950 border-rose-950
export const COLORS = [
  {   
    label: 'Black',
    value: 'black',
    tw: 'zinc-900' 
  },
  {   
    label: 'White',
    value: 'white',
    tw: 'white' 
  },
  {
    label: 'Maroon',
    value: 'maroon',
    tw: 'maroon',
  },
  {   
    label: 'Mint', 
    value: 'mint', 
    tw: 'mint' 
  },
  {   
    label: 'Mustard', 
    value: 'mustard', 
    tw: 'mustard' 
  },
  {   
    label: 'Olive', 
    value: 'olive', 
    tw: 'olive' 
  },
  {   
    label: 'Pista', 
    value: 'pista', 
    tw: 'pista' 
  },
  {   
    label: 'Purple', 
    value: 'purple', 
    tw: 'purple' 
  },
  {   
    label: 'Red', 
    value: 'red', 
    tw: 'red' 
  },
  {   
    label: 'Blue', 
    value: 'royal_blue', 
    tw: 'royal_blue' 
  },
  {   
    label: 'Sky Blue', 
    value: 'skyblue', 
    tw: 'skyblue' 
  },
  {   
    label: 'Teal', 
    value: 'teal', 
    tw: 'teal' 
  },
  
] as const

export const MODELS = {
  name: 'models',
  options: [
    {
      label: 'XXS',
      value: 'xxs',
    },
    {
      label: 'XS',
      value: 'xs',
    },
    {
      label: 'S',
      value: 's',
    },
    {
      label: 'M',
      value: 'm',
    },
    {
      label: 'L',
      value: 'l',
    },
    {
      label: 'XL',
      value: 'xl',
    },
    {
      label: 'XXL',
      value: 'xxl',
    },
  ],
} as const

export const SLEEVE = {
  name: 'sleeves',
  options: [
    {
      label: 'Half Sleeve',
      value: 'half',
    },
    {
      label: 'Full Sleeve',
      value: 'full',
    },
    {
      label: 'Drop Shoulder',
      value: 'dropShoulder',
    },
    {
      label: 'Sleeveless',
      value: 'sleeveless',
    },
    // {
    //   label: 'Raglan sleeve',
    //   value: 'raglan',
    // },
  ],
} as const

export const NECK = {
  name: 'neck',
  options: [
    {
      label: 'Round Neck',
      value: 'round',
    },
    {
      label: 'V Neck',
      value: 'v',
    },
    {
      label: 'Polo',
      value: 'polo',
    },
  ],
} as const

export const Quantity = {
  name: 'quantity',
  options: [
    {
      label: 1,
      value: 'one',
    },
    {
      label: 2,
      value: 'two',
    },
    {
      label: 3,
      value: 'three',
    },{
      label: 4,
      value: 'four',
    },
    {
      label: 5,
      value: 'five',
    },
    {
      label: 6,
      value: 'six',
    },
    {
      label: 7,
      value: 'seven',
    },
    {
      label: 8,
      value: 'eight',
    },
    {
      label: 9,
      value: 'nine',
    },
    {
      label: 10,
      value: 'ten',
    },
  ],
} as const