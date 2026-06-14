# AGENTS.md

本仓库是一个 Raycast 扩展组件仓库。在本仓库内进行任何修改时，请遵循以下说明。

## 项目概览

- 技术栈：基于 `@raycast/api` 和 `@raycast/utils` 开发的 Raycast 扩展。
- 源码目录：`src/`。
- 静态资源目录：`assets/`。
- 额外实现说明和开发文档目录：`docs/`。

## 开发规范

- 保持修改聚焦，遵循现有 TypeScript 和 Raycast 代码风格。
- 新增 UI 命令时，优先使用小而可组合的 React/Raycast 组件和 hook。
- 新增、删除或重命名 Raycast command 时，需要同步更新 `package.json` 中的 command 元数据。
- 除非确有必要，不要引入新的依赖。
- 需要验证时，优先使用仓库已有脚本：
  - `pnpm run lint`
  - `pnpm run build`
  - `pnpm run dev`

## 搜索相关组件

如果需要修改任何slink相关的组件、逻辑、hook 或 command，必须先阅读 `./docs/slink.md`，并遵循其中的说明。

## 文档维护

- 当行为、命令或开发流程发生变化时，需要同步更新 `README.md` 或 `docs/` 下的相关文档。
- 文档应保持简洁，并与当前实现保持一致。
