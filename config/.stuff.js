const devConfig = {
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'password',
  database: 'cws_admin'
};

const prodConfig = {
  host: 'localhost',
  user: 'thesyste_prodsqluser',
  port: '3306',
  password: '7W3#R$zu^$nbxF',
  database: 'thesyste_cws_admin'
};

const sitConfig = {
  host: 'localhost',
  user: 'thesyste_sitsqluser',
  port: '3306',
  password: 'FfhZzp3Sz6*W$Z',
  database: 'thesyste_sit_cws_admin'
};

const uatConfig = {
  host: 'localhost',
  user: 'thesyste_uatsqluser',
  port: '3306',
  password: 'fzVJSa1k64b@Rr',
  database: 'thesyste_uat_cws_admin'
};

const reportConfig = {
  host: 'localhost',
  user: 'thesyste_reportuser',
  port: '3306',
  password: '92#A&4tBCXMfJ3',
  database: 'thesyste_reports'
};

module.exports = {
  devConfig: devConfig,
  prodConfig: prodConfig,
  sitConfig: sitConfig,
  uatConfig: uatConfig,
  reportConfig: reportConfig
};
