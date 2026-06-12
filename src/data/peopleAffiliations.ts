/**
 * Institutions, enterprises and communities represented by voices in the film.
 * Logos sourced from gez.studio/partners and official org websites.
 * Orgs already in `film.partners` are omitted here to avoid duplicate rows.
 */
export interface PeopleAffiliation {
  id: string;
  name: string;
  url: string;
  logoSrc: string;
}

export const peopleAffiliations: PeopleAffiliation[] = [
  {
    id: 'africa-farmers',
    name: 'Afarmers AgriTech & Leadership Centre',
    url: 'https://africafarmers.org/',
    logoSrc: '/partners/logos/people/africa-farmers.png',
  },
  {
    id: 'black-tulip-group',
    name: 'Sunfloritech (Black Tulip Group)',
    url: 'https://btfgroup.com/sunfloritech-ltd/',
    logoSrc: '/partners/logos/people/black-tulip-group.png',
  },
  {
    id: 'cgiar',
    name: 'CGIAR',
    url: 'https://www.cgiar.org/',
    logoSrc: '/partners/logos/people/cgiar.png',
  },
  {
    id: 'cropnuts',
    name: 'CropNuts',
    url: 'https://cropnuts.com/',
    logoSrc: '/partners/logos/people/cropnuts.svg',
  },
  {
    id: 'homa-bay-county',
    name: 'Homa Bay County Government',
    url: 'https://homabay.go.ke/',
    logoSrc: '/partners/logos/people/homa-bay-county.png',
  },
  {
    id: 'holland-greentech',
    name: 'Holland Greentech',
    url: 'https://www.hollandgreentech.com/',
    logoSrc: '/partners/logos/people/holland-greentech.png',
  },
  {
    id: 'jagannath-growers',
    name: 'Jagannath Growers',
    url: 'https://www.jagannathgrowers.org/',
    logoSrc: '/partners/logos/people/jagannath-growers.png',
  },
  {
    id: 'marula-proteen',
    name: 'Marula Proteen Ltd',
    url: 'https://weareproteen.com/',
    logoSrc: '/partners/logos/people/marula-proteen.png',
  },
  {
    id: 'rockefeller-foundation',
    name: 'The Rockefeller Foundation',
    url: 'https://www.rockefellerfoundation.org/',
    logoSrc: '/partners/logos/people/rockefeller-foundation.png',
  },
  {
    id: 'talk-africa',
    name: 'Talk Africa (AFJ Kenya)',
    url: 'https://www.talkafrica.co.ke/',
    logoSrc: '/partners/logos/people/talk-africa.png',
  },
  {
    id: 'uasin-gishu-county',
    name: 'Uasin Gishu County Government',
    url: 'https://uasingishu.go.ke/',
    logoSrc: '/partners/logos/people/uasin-gishu-county.png',
  },
  {
    id: 'daily-nation',
    name: 'Daily Nation',
    url: 'https://nation.africa/',
    logoSrc: '/partners/logos/people/daily-nation.png',
  },
];
