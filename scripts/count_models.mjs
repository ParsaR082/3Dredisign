import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const models = [
    'abnerAbnerbenefit', 'abnerAbnercitytvmodel', 'abnerAbnerfeature', 'abnerAbnergalleryitem',
    'abnerAbnerpage', 'abnerAbnerproduct', 'abnerAbnersharedspec', 'abnerAbnerstandmodel',
    'aboutAboutgalleryimage', 'aboutAboutpagesettings', 'aboutAboutstat', 'aboutCorevalue',
    'aboutPanoramascene', 'aboutPanoramatourconfig', 'aboutTechlead', 'aboutTimemachinestep',
    'authUser', 'backstageBackstagecategory', 'backstageBackstageimage', 'backstageBackstageitem',
    'backstageBackstagepagesettings', 'backstageBackstagevideo', 'blogBlogauthor', 'blogBlogcategory',
    'blogBlogsettings', 'blogBlogtag', 'blogPost', 'contactConsultationbooking', 'contactContactmessage',
    'contactContactpagesettings', 'contactNewslettersubscriber', 'contactProjectwizardsubmission',
    'portfolioIndustry', 'portfolioPortfoliopagesettings', 'portfolioProject', 'portfolioProjectcategory',
    'portfolioProjectimage', 'portfolioProjectvideo', 'portfolioTechnology', 'pricingPricingfeature',
    'pricingPricingpagesettings', 'pricingPricingplan', 'publicInstagramreel', 'publicLandingcounter',
    'publicLandinggrowthstat', 'publicLandingpage', 'publicLandingprocessstep', 'publicLandingroiconfig',
    'publicLandingtestimonial', 'publicLandingtickeritem', 'publicLandingwhyitem', 'publicSitesettings',
    'serviceCasestudy', 'serviceProcessstep', 'serviceService', 'serviceServicebundle',
    'serviceServicecategory', 'serviceServicefaq', 'serviceServicefeature', 'serviceServicepagesettings',
    'serviceServiceroi', 'serviceTechstack', 'websitesWebsite', 'websitesWebsitecategory',
    'websitesWebsitefeature', 'websitesWebsitepagesettings', 'websitesWebsitescreenshot'
  ];

  console.log('Model counts:');
  for (const m of models) {
    try {
      const count = await prisma[m].count();
      console.log(`${m}: ${count}`);
    } catch (e) {
      console.log(`${m}: ERROR ${e.message}`);
    }
  }
}

check().finally(() => prisma.$disconnect());
