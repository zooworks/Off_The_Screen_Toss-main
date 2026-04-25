if (import.meta.env.DEV) {
  const w = window as any;
  w.__CONSTANT_HANDLER_MAP = {
    deploymentId: "dev-local",
    brandDisplayName: "Off The Screen",
    brandIcon: "https://static.toss.im/appsintoss/17199/3825b143-cdef-4e94-b173-9ae366320d8c.png",
    brandPrimaryColor: "#0064FF",
    getOperationalEnvironment: "live",
    getTossAppVersion: "5.0.0",
    getPlatformOS: "ios",
    getDeploymentId: "dev-local",
    getSafeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
    ...(w.__CONSTANT_HANDLER_MAP ?? {}),
  };
  w.ReactNativeWebView ??= { postMessage: () => {} };
  w.__GRANITE_NATIVE_EMITTER ??= { on: () => () => {} };
}
