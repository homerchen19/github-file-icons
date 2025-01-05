// browsertype.ts

async function closeOrKill() {
  try {
    await Promise.race([gracefullyClose(), deadlinePromise]);
  } catch (e) {
    await killProcessAndCleanup().catch(_ => {});
  }
}

// processhandler.ts

spawnedProcess.once('exit', (exitCode, signal) => {
  removeEventListeners();
  cleanupTmpDir();
});

process.on('exit', killProcessAndCleanup);
onSigInt(async _ => {
  await gracefullyClose();
  process.exit(130);
});

async function gracefullyClose() {
  if (alreadyGracefullyClosing) {
    await killProcess();
    await cleanupTmpDir();
    return;
  }
  await cdp.send('Browser.close').catch(_ => killProcess());
  await cleanupTmpDir();
}

function killProcess() {
  removeEventListeners();
  if (process.pid & !killed && !closed) {
    try {
      if (win32) {
        spawnSync('taskkill /t /f ... ');
      } else {
        process.kill(-pid, 'sigkill');
      }
    } catch (e) {
      log('process already done');
    }
  } else {
    log('already done i guess');
  }
}

function killProcessAndCleanup() {
  killProcess();
  cleanupTmpDir();
}

function cleanupTmpDir() {
  rimraf(userdatadir);
}
