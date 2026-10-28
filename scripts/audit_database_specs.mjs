import fs from 'fs';

const schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf8');
const pgSchemaContent = fs.readFileSync('prisma/schema.postgresql.prisma', 'utf8');

const expectedTables = [
  // 3.1 service (10 models + 2 M2M = 12 tables)
  'service_servicecategory',
  'service_service',
  'service_servicefeature',
  'service_techstack',
  'service_servicebundle',
  'service_serviceroi',
  'service_processstep',
  'service_casestudy',
  'service_servicefaq',
  'service_servicepagesettings',
  'service_service_technologies',
  'service_servicebundle_services',

  // 3.2 portfolio (7 models + 2 M2M = 9 tables)
  'portfolio_projectcategory',
  'portfolio_industry',
  'portfolio_technology',
  'portfolio_project',
  'portfolio_projectvideo',
  'portfolio_projectimage',
  'portfolio_portfoliopagesettings',
  'portfolio_project_additional_categories',
  'portfolio_project_technologies',

  // 3.3 public (11 tables)
  'public_landingpage',
  'public_landingtickeritem',
  'public_landingwhyitem',
  'public_landingcounter',
  'public_landinggrowthstat',
  'public_landingprocessstep',
  'public_landingtestimonial',
  'public_sitesettings',
  'public_landingroiconfig',
  'public_instagramreelsconfig',
  'public_instagramreel',

  // 3.4 blog (6 models + 2 M2M = 8 tables)
  'blog_blogcategory',
  'blog_blogtag',
  'blog_blogauthor',
  'blog_postseries',
  'blog_blogsettings',
  'blog_post',
  'blog_post_tags',
  'blog_post_related_services',

  // 3.5 contact (6 tables)
  'contact_contactmessage',
  'contact_newslettersubscriber',
  'contact_consultationblockeddate',
  'contact_consultationbooking',
  'contact_projectwizardsubmission',
  'contact_contactpagesettings',

  // 3.6 about (8 tables)
  'about_aboutpagesettings',
  'about_techlead',
  'about_corevalue',
  'about_timemachinestep',
  'about_aboutstat',
  'about_aboutgalleryimage',
  'about_panoramatourconfig',
  'about_panoramascene',

  // 3.7 pricing (3 tables)
  'pricing_pricingplan',
  'pricing_pricingfeature',
  'pricing_pricingpagesettings',

  // 3.8 backstage (5 tables)
  'backstage_backstagecategory',
  'backstage_backstagepagesettings',
  'backstage_backstageitem',
  'backstage_backstageimage',
  'backstage_backstagevideo',

  // 3.9 websites (5 tables)
  'websites_websitecategory',
  'websites_websitepagesettings',
  'websites_website',
  'websites_websitefeature',
  'websites_websitescreenshot',

  // 3.10 abner (8 tables)
  'abner_abnerpage',
  'abner_abnerfeature',
  'abner_abnerbenefit',
  'abner_abnerproduct',
  'abner_abnercitytvmodel',
  'abner_abnerstandmodel',
  'abner_abnersharedspec',
  'abner_abnergalleryitem',

  // 5. auth (6 tables)
  'auth_user',
  'auth_group',
  'auth_permission',
  'auth_user_groups',
  'auth_user_user_permissions',
  'auth_group_permissions',
];

function auditSchema(name, content) {
  console.log(`\n================================`);
  console.log(` AUDITING ${name}`);
  console.log(`================================`);

  const mappedTables = [];
  const mapRegex = /@@map\("([^"]+)"\)/g;
  let match;
  while ((match = mapRegex.exec(content)) !== null) {
    mappedTables.push(match[1]);
  }

  const missing = expectedTables.filter((t) => !mappedTables.includes(t));
  const extra = mappedTables.filter((t) => !expectedTables.includes(t));

  console.log(`Expected tables count: ${expectedTables.length}`);
  console.log(`Found mapped tables count: ${mappedTables.length}`);

  if (missing.length === 0 && extra.length === 0) {
    console.log(`>>> 100% PERFECT MATCH! All ${expectedTables.length} tables are present with zero missing/extra.`);
  } else {
    if (missing.length > 0) console.log(`Missing tables:`, missing);
    if (extra.length > 0) console.log(`Extra tables:`, extra);
  }

  return { missing, extra };
}

auditSchema('SQLite (prisma/schema.prisma)', schemaContent);
auditSchema('PostgreSQL (prisma/schema.postgresql.prisma)', pgSchemaContent);
