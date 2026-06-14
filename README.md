# lewis_extensions

`lewis_extensions` 是一个个人 Raycast 扩展集合，用于沉淀日常工作中常用的小工具命令。目前已实现本地链接搜索命令，可通过 Raycast 快速检索并打开预先配置好的链接。

## 前置依赖

- Raycast：本插件依赖 Raycast 运行。
- Raycast 官方地址：[https://www.raycast.com/](https://www.raycast.com/)
- Node.js / pnpm：用于安装依赖、开发和构建本插件。

## 安装方式

1. 克隆或下载本项目到本地。
2. 安装依赖：

   ```bash
   pnpm install
   ```

3. 构建插件：

   ```bash
   pnpm run build:dist
   ```

4. 构建产物会输出到 `dist/` 目录。在 Raycast 中使用 **Import Extension**，选择本项目或构建输出目录进行本地导入。

开发调试时也可以运行：

```bash
pnpm run dev
```

## 已完成命令

### Slink

- Raycast command：`Slink`
- 功能：根据本地配置文件中的链接名称进行搜索，并在选择结果后用默认浏览器打开对应链接。
- 数据文件路径：`~/.config/raycast/lewis_extensions_etc/slink.json`

#### 配置文件格式

`slink.json` 需要是一个数组，每一项包含：

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
    "name": "GitHub",
    "description": "打开 GitHub 官网",
    "clk_url": "https://github.com/"
  }
]
```

#### 用法说明

1. 在本地创建配置目录和配置文件：

   ```bash
   mkdir -p ~/.config/raycast/lewis_extensions_etc
   touch ~/.config/raycast/lewis_extensions_etc/slink.json
   ```

2. 按照上面的 JSON 格式写入需要搜索的链接数据。
3. 在 Raycast 中打开 `Slink` 命令。
4. 在搜索框中输入关键词，命令会按 `name` 字段进行匹配。
5. 选择搜索结果并执行“打开链接”，即可在默认浏览器中打开对应的 `clk_url`。

当配置文件不存在、内容为空或没有匹配结果时，命令会展示“暂无搜索结果”。
