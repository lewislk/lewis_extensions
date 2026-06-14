# 搜索组件说明

本文档描述 Raycast 扩展中搜索组件的目标行为、数据来源、数据结构和交互流程，便于后续实现与维护。

## 功能目标

在 Raycast 中搭建一个搜索框，用户输入关键词后，从本地配置文件读取可搜索数据，并根据 `name` 字段匹配搜索结果。

- 数据文件路径：`~/.config/raycast/lewis_extensions_etc/slink.json`
- 匹配字段：`name`
- 结果展示字段：`name`、`description`
- 点击结果行为：根据 `clk_url` 唤起浏览器并跳转到对应 URL
- 无匹配结果：显示“暂无搜索结果”

## 数据结构

`slink.json` 应为一个数组，每一项包含以下字段：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | 是 | 搜索匹配字段，同时作为结果标题展示 |
| `description` | `string` | 是 | 搜索结果描述文案 |
| `clk_url` | `string` | 是 | 点击搜索结果后打开的目标 URL |

示例：

```json
[
  {
    "name": "Raycast 文档",
    "description": "打开 Raycast 官方开发文档",
    "clk_url": "https://developers.raycast.com/"
  },
  {
    "name": "OpenAI",
    "description": "打开 OpenAI 官网",
    "clk_url": "https://openai.com/"
  }
]
```

## 搜索流程

1. Raycast command 渲染一个搜索列表或搜索框。
2. 用户在搜索框中输入关键词。
3. 组件读取 `~/.config/raycast/lewis_extensions_etc/slink.json`。
4. 将用户输入与每一项的 `name` 字段进行匹配。
5. 如果存在匹配项，则渲染搜索结果列表。
6. 如果不存在匹配项，则显示空状态文案“暂无搜索结果”。
7. 用户点击某个搜索结果时，通过该项的 `clk_url` 打开浏览器并跳转。

## 匹配规则

建议使用简单、可预期的包含匹配：

- 仅匹配 `name` 字段，不匹配 `description` 或 `clk_url`。
- 忽略大小写，提升搜索容错性。
- 去除用户输入首尾空格后再搜索。
- 当输入为空时，可展示全部数据，或展示空状态；具体行为应在实现中保持一致。

推荐匹配逻辑：

```ts
const keyword = searchText.trim().toLowerCase();
const results = items.filter((item) => item.name.toLowerCase().includes(keyword));
```

## UI 展示要求

搜索结果项需要展示：

- 标题：`name`
- 描述：`description`

空结果时展示：

- 标题或空状态文案：`暂无搜索结果`

## 点击行为

点击搜索结果时，使用 Raycast API 唤起默认浏览器打开 `clk_url`。

实现时可使用：

```ts
import { open } from "@raycast/api";

await open(item.clk_url);
```

## 异常处理

实现搜索组件时需要考虑以下情况：

- `slink.json` 文件不存在：展示“暂无搜索结果”或适当错误提示。
- `slink.json` 内容不是合法 JSON：展示错误提示，避免命令崩溃。
- 数据项缺少必填字段：忽略该项，避免渲染无效结果。
- `clk_url` 为空或不是合法 URL：禁用点击行为或忽略该项。

## 实现建议

- 读取文件时应展开用户目录 `~`，定位到当前用户的 home 目录。
- 可使用 `fs/promises` 读取 `slink.json`。
- 可使用 `List` 的 `searchBarPlaceholder` 提示用户输入搜索关键词。
- 数据读取、过滤逻辑和 UI 渲染建议拆分为小函数或 hook，便于测试与复用。
- 新增或调整搜索 command 时，需要同步更新 `package.json` 中的 command 元数据。
