const log = require('npmlog');
const xcode = require('xcode');
const fs = require('fs');

log.heading = 'rnpm-upgrade';

const upgradeIOSProject = (projectConfig) => {
  const project = xcode.project(projectConfig.pbxprojPath).parseSync();

  // xcode package does not handle duplicates, so safe to just try removing
  // in case one already has them
  project.removeFromOtherLinkerFlags('"-lc++"');
  project.addToOtherLinkerFlags('"-lc++"');

  fs.writeFileSync(
    projectConfig.pbxprojPath,
    project.writeSync()
  );
};

module.exports = function upgrade(config, args) {
  var project;

  try {
    project = config.getProjectConfig();
  } catch (err) {
    log.error(
      'ERRPACKAGEJSON',
      'No package found. Are you sure it\'s a React Native project?'
    );
    return Promise.reject(err);
  }

  if (project.ios) {
    log.info('Upgrading your iOS project from 0.25 to 0.26');
    upgradeIOSProject(project.ios);
    log.info('Upgrade finished');
  }
};
