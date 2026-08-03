import mariage from './mariage'
import chiot from './chiot'
import dog from './dog'
import blogPost from './blogPost'
import siteSettings from './siteSettings'
import pageSection from './pageSection'
import mariagesSection from './mariagesSection'
import actualitesSection from './actualitesSection'
import malesSection from './malesSection'
import femellesSection from './femellesSection'
import homePage from './homePage'
import aboutPage from './aboutPage'
import contactPage from './contactPage'
import portfolioPage from './portfolioPage'
import inquiryPage from './inquiryPage'
import actualitesPage from './actualitesPage'

export const schemaTypes = [
  // Singletons (site-wide / one per page)
  siteSettings,
  homePage,
  aboutPage,
  contactPage,
  portfolioPage,
  inquiryPage,
  actualitesPage,
  // Repeatable documents
  dog,
  mariage,
  chiot,
  blogPost,
  // Reusable objects
  pageSection,
  mariagesSection,
  actualitesSection,
  malesSection,
  femellesSection,
]
