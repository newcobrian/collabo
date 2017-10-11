import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
// import { Meteor } from 'meteor/meteor';
// import { _ } from 'meteor/underscore';

const seoImages = {
  openGraph: [
    'open-graph-blue.png',
    'open-graph-green.png',
    'open-graph-red.png',
    'open-graph-yellow.png',
  ],
  twitter: [
    'twitter-card-blue.png',
    'twitter-card-green.png',
    'twitter-card-red.png',
    'twitter-card-yellow.png',
  ],
  google: [
    'google-blue.png',
    'google-green.png',
    'google-red.png',
    'google-yellow.png',
  ],
};

// const seoImageURL = file => `https://s3.amazonaws.com/tmc-site-assets/graphics/${file}`;
// const seoURL = path => Meteor.absoluteUrl(path);

const getMetaTags = ({
  title, description, url, contentType, published, updated, category, tags, twitter,
}) => {
  const metaTags = [
    { itemprop: 'name', content: title },
    { itemprop: 'description', content: description },
    // { itemprop: 'image', content: seoImageURL(_.sample(seoImages.google)) },
    { name: 'description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@viewsguides' },
    { name: 'twitter:title', content: `${title} | Views` },
    { name: 'twitter:description', content: description },
    { name: 'twitter:creator', content: twitter || '@viewsguides' },
    // { name: 'twitter:image:src', content: seoImageURL(_.sample(seoImages.twitter)) },
    { name: 'og:title', content: `${title} | Views` },
    { name: 'og:type', content: contentType },
    { name: 'og:url', content: url },
    // { name: 'og:image', content: seoImageURL(_.sample(seoImages.openGraph)) },
    { name: 'og:description', content: description },
    { name: 'og:site_name', content: 'Views' },
    { name: 'fb:app_id', content: '<FB App ID>' },
  ];

  if (published) metaTags.push({ name: 'article:published_time', content: published });
  if (updated) metaTags.push({ name: 'article:modified_time', content: updated });
  if (category) metaTags.push({ name: 'article:section', content: category });
  if (tags) metaTags.push({ name: 'article:tag', content: tags });

  return metaTags;
};

const SEO = ({
  schema, title, description, path, contentType, published, updated, category, tags, twitter,
}) => (
  <Helmet
    htmlAttributes={{
      lang: 'en',
      itemscope: undefined,
      itemtype: `http://schema.org/${schema}`,
    }}
    title={ title }
    link={[
      // { rel: 'canonical', href: seoURL(path) },
      { rel: 'canonical', href: 'myviews.io/' + path },
    ]}
    meta={getMetaTags({
      title,
      description,
      contentType,
      // url: seoURL(path),
      url: 'myviews.io/' + path,
      published,
      updated,
      category,
      tags,
      twitter,
    })}
  />
);

SEO.propTypes = {
  schema: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  path: PropTypes.string,
  contentType: PropTypes.string,
  published: PropTypes.string,
  updated: PropTypes.string,
  category: PropTypes.string,
  tags: PropTypes.array,
  twitter: PropTypes.string,
};

export default SEO;