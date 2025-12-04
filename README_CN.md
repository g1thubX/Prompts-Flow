# PromptFlow

<div align="center">

[ English ](README.md) | **[ 中文 ]**

</div>

> "最好的工具是隐形的。它不应该像是一个软件，而更像是你思维的延伸。"

**PromptFlow** 不仅仅是一个 Chrome 插件；它是一个生活在你浏览器中的、本地优先的 **数字有机体 (Digital Organism)**。它的存在是为了加速你与人工智能的思维共振。

它拒绝现代 SaaS 仪表盘的繁杂与喧嚣。它拥抱功能主义的静谧。它完全寄居在你的机器中，尊重你的隐私，也尊重你的每一次击键。

---

## 🧬 基因代码 (设计哲学)

这个有机体经过精心培育，拥有特殊的性状，以确保在极高速度的工作流中生存：

### 1. Obsidian Aesthetics (黑曜石美学)
我拥有一层半透明的磨砂皮肤 (`backdrop-blur-2xl`)。我悬浮在你的内容之上，深邃而优雅，既融入你的工作空间，又保持完美的视觉对比度。

### 2. Speed is Survival (唯快不破)
鼠标的移动是缓慢的，思维的跳跃是瞬间的。我的设计初衷是完全通过键盘操作。
- `↑` `↓` 巡游记忆。
- `Enter` 注入思想。
- `Tab` 填充变量。

### 3. Hiding the Difficulty (举重若轻)
复杂的 Prompt 往往需要动态的变量（例如：*写一封语气 {{tone}} 的邮件给 {{name}}*）。我不会用丑陋的表单来增加你的负担。我会无缝变形为一个“密码锁”式的界面，让你以令人愉悦的精确度将变量嵌入其中。

### 4. Local Symbiosis (本地共生)
我不向云端传输数据。我依赖 **IndexedDB**——你浏览器原生的、高性能的记忆皮层。你的 Prompt 就是你的神经元；它们永远不会离开你的设备。

### 5. Universal Tongue (双语共鸣)
我通晓你的语言。只需点击（或按键），我便能在 **English** 和 **中文** 之间瞬间切换，完美适应你的认知模式。

---

## 🫀 解剖结构 (技术栈)

我的躯体由稳健、永恒的材料构建：

- **核心 (Core):** React 18 (神经系统)
- **皮肤 (Skin):** Tailwind CSS (黑曜石/玻璃拟态 配色)
- **记忆 (Memory):** IndexedDB (持久化存储, 零依赖)
- **字体 (Font):** Outfit (界面) & JetBrains Mono (代码)

---

## 🌿 如何培育 (使用指南)

1. **召唤 (Summoning)**: 打开扩展程序（建议绑定快捷键）。
2. **白板 (Tabula Rasa)**: 如果我是空的，输入 `New` 并按下 `Enter`（或点击底部的 `+ New` 按钮），创造一个新的思维记忆。
3. **变量注入 (Variable Injection)**: 在你的 Prompt 中使用 `{{variable_name}}` 语法。当你再次调用它时，我会请你填补这些空白。
4. **搜索 (Search)**: 尽管输入。我会瞬间过滤出你的思绪。
5. **语言 (Language)**: 点击底部的 EN/中 切换按钮，选择你偏好的界面语言。

---

## 🏗️ 发育架构

这个仓库孕育了两种生命形态：Web 应用程序和 Chrome 扩展程序。

### 1. Web 应用程序 (模拟器)
位于根目录。用于在标准浏览器环境中开发和测试 UI。

```bash
# 安装依赖
npm install

# 在培养皿中运行有机体 (localhost)
npm run dev
```

### 2. Chrome 扩展程序 (共生体)
位于 `extension/` 目录。这是实际生活在你浏览器中的插件。

```bash
# 进入扩展程序舱室
cd extension

# 安装依赖
npm install

# 构建有机体以进行部署
npm run build
```

**加载到 Chrome:**
1. 打开 `chrome://extensions`
2. 开启 "开发者模式 (Developer mode)"
3. 点击 "加载已解压的扩展程序 (Load unpacked)"
4. 选择 `extension/dist` 文件夹 (运行 `npm run build` 后生成)。

---

## 🌱 提供养分 (贡献指南)

我是一个年轻的有机体。我需要养分来进化。

我正在寻找 **园丁 (贡献者)**，那些真正理解 **Less is More** 的人。
- 不要为了增加功能而增加功能。
- 不要破坏对称性。
- 不要侵犯隐私。

**进化路线图:**
- [x] **玻璃拟态 (Glassmorphism)**: 增强视觉深度与质感。
- [x] **双语核心 (Bilingual Core)**: 原生支持中英文切换。
- [ ] **智能语境 (Smart Context)**: 感知当前是否在 LinkedIn/Twitter，并建议相关的 Prompt。
- [ ] **同步腺体 (Sync Glands)**: 可选的、加密的导出/导入功能，用于跨设备授粉。

---

## 📜 许可

基于 MIT 协议分发。我可以自由地生活在任何人的机器里。


## 🌟 生长历史

每一颗 Star 都是帮助我生长的一个光子。

[![Star History Chart](https://api.star-history.com/svg?repos=YourUsername/PromptFlow&type=Date)](https://star-history.com/#YourUsername/PromptFlow&Date)
