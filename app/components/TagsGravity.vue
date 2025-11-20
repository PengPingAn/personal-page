<template>
  <div class="icon-gravity-container">
    <div ref="iconCanvas" class="icon-canvas">
      <div
        v-for="(icon, index) in icons"
        :key="index"
        class="icon"
        :class="`icon-${index + 1}`"
      >
        <img :src="icon" class="icon-img" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  icons: {
    type: Array,
    default: () => [],
  },
  iconSize: {
    type: Number,
    default: 70, // 默认70像素
  },
});
const iconCanvas = ref(null);

// 物理模拟代码
let engine = null;
let render = null;
let mouseConstraint = null;

const initSimulation = () => {
  if (!window.Matter) {
    console.error("Matter.js not loaded");
    return;
  }

  const Matter = window.Matter;
  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const MouseConstraint = Matter.MouseConstraint;
  const Mouse = Matter.Mouse;
  const Events = Matter.Events;
  const Body = Matter.Body;

  const containerElement = iconCanvas.value;
  engine = Engine.create();
  const world = engine.world;

  // 引擎设置
  engine.world.gravity.y = 0.6;
  engine.constraintIterations = 3;
  engine.positionIterations = 8;
  engine.velocityIterations = 6;

  const containerWidth = containerElement.clientWidth;
  const containerHeight = containerElement.clientHeight;

  // 创建渲染器
  render = Render.create({
    element: containerElement,
    engine: engine,
    options: {
      width: containerWidth,
      height: containerHeight,
      background: "transparent",
      wireframes: false,
      showBounds: false,
      showVelocity: false,
      showAngleIndicator: false,
      showDebug: false,
    },
  });

  // 样式化画布
  if (render.canvas) {
    render.canvas.style.border = "none";
    render.canvas.style.outline = "none";
    render.canvas.style.position = "absolute";
    render.canvas.style.top = "0";
    render.canvas.style.left = "0";
    render.canvas.style.width = "100%";
    render.canvas.style.height = "100%";
  }

  Render.run(render);
  Engine.run(engine);

  // 创建边界
  const thickness = 100;

  const ground = Bodies.rectangle(
    containerWidth / 2,
    containerHeight + thickness / 2,
    containerWidth + thickness * 2,
    thickness,
    { isStatic: true, render: { fillStyle: "transparent" } }
  );

  const wallLeft = Bodies.rectangle(
    -thickness / 2,
    containerHeight / 2,
    thickness,
    containerHeight + thickness * 2,
    { isStatic: true, render: { fillStyle: "transparent" } }
  );

  const wallRight = Bodies.rectangle(
    containerWidth + thickness / 2,
    containerHeight / 2,
    thickness,
    containerHeight + thickness * 2,
    { isStatic: true, render: { fillStyle: "transparent" } }
  );

  const roof = Bodies.rectangle(
    containerWidth / 2,
    -thickness / 2,
    containerWidth + thickness * 2,
    thickness,
    { isStatic: true, render: { fillStyle: "transparent" } }
  );

  World.add(world, [ground, wallLeft, wallRight, roof]);

  // 创建图标体
  const iconElements = containerElement.querySelectorAll(".icon");
  const iconBodies = Array.from(iconElements).map((icon) => {
    const width = icon.offsetWidth;
    const height = icon.offsetHeight;

    const margin = 60;
    const x = Math.random() * (containerWidth - width - margin * 2) + width / 2 + margin;
    const y =
      Math.random() * (containerHeight - height - margin * 2) + height / 2 + margin;

    const body = Bodies.rectangle(x, y, width, height, {
      chamfer: { radius: height / 2 },
      density: 0.008,
      friction: 0.3,
      frictionAir: 0.02,
      restitution: 0.4,
      render: { fillStyle: "transparent" },
    });

    World.add(world, body);
    return { body, element: icon };
  });

  // 检查边界并限制速度
  const checkBounds = () => {
    iconBodies.forEach(({ body }) => {
      const { x, y } = body.position;
      const margin = 50;

      if (
        x < -margin ||
        x > containerWidth + margin ||
        y < -margin ||
        y > containerHeight + margin
      ) {
        Body.setPosition(body, {
          x: containerWidth / 2 + (Math.random() - 0.5) * 100,
          y: containerHeight / 4 + Math.random() * 100,
        });
        Body.setVelocity(body, { x: 0, y: 0 });
        Body.setAngularVelocity(body, 0);
      }

      const maxVelocity = 15;
      if (Math.abs(body.velocity.x) > maxVelocity) {
        Body.setVelocity(body, {
          x: Math.sign(body.velocity.x) * maxVelocity,
          y: body.velocity.y,
        });
      }
      if (Math.abs(body.velocity.y) > maxVelocity) {
        Body.setVelocity(body, {
          x: body.velocity.x,
          y: Math.sign(body.velocity.y) * maxVelocity,
        });
      }

      const maxAngularVelocity = 0.3;
      if (Math.abs(body.angularVelocity) > maxAngularVelocity) {
        Body.setAngularVelocity(
          body,
          Math.sign(body.angularVelocity) * maxAngularVelocity
        );
      }
    });
  };

  // 同步 HTML 元素与物理引擎
  Events.on(engine, "afterUpdate", () => {
    checkBounds();

    iconBodies.forEach(({ body, element }) => {
      const { x, y } = body.position;
      const angle = body.angle;

      element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}rad)`;
    });
  });

  const mouse = Mouse.create(render.canvas);
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.15,
      render: { visible: false },
    },
  });

  World.add(world, mouseConstraint);

  const clearMouseConstraint = () => {
    if (mouseConstraint) {
      mouseConstraint.body = null;
      if (mouseConstraint.constraint) {
        mouseConstraint.constraint.bodyB = null;
      }
      if (mouseConstraint.mouse) {
        mouseConstraint.mouse.button = -1;
      }
    }
  };

  render.canvas.addEventListener("mouseleave", () => {
    clearMouseConstraint();
  });

  render.canvas.addEventListener("touchcancel", () => {
    clearMouseConstraint();
  });

  document.addEventListener(
    "mouseup",
    () => {
      clearMouseConstraint();
    },
    true
  );

  document.addEventListener(
    "touchend",
    () => {
      clearMouseConstraint();
    },
    true
  );

  // 处理窗口大小调整
  const handleResize = () => {
    const newWidth = containerElement.clientWidth;
    const newHeight = containerElement.clientHeight;

    render.canvas.width = newWidth;
    render.canvas.height = newHeight;
    render.options.width = newWidth;
    render.options.height = newHeight;

    // 更新边界
    World.clear(world, false);
    Engine.clear(engine);

    const ground = Bodies.rectangle(
      newWidth / 2,
      newHeight + thickness / 2,
      newWidth + thickness * 2,
      thickness,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );

    const wallLeft = Bodies.rectangle(
      -thickness / 2,
      newHeight / 2,
      thickness,
      newHeight + thickness * 2,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );

    const wallRight = Bodies.rectangle(
      newWidth + thickness / 2,
      newHeight / 2,
      thickness,
      newHeight + thickness * 2,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );

    const roof = Bodies.rectangle(
      newWidth / 2,
      -thickness / 2,
      newWidth + thickness * 2,
      thickness,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );

    World.add(world, [ground, wallLeft, wallRight, roof, mouseConstraint]);
    iconBodies.forEach(({ body }) => World.add(world, body));
  };

  window.addEventListener("resize", handleResize);

  // 返回清理函数
  return () => {
    window.removeEventListener("resize", handleResize);
    if (render) {
      Render.stop(render);
    }
    if (engine) {
      Engine.clear(engine);
      World.clear(engine.world, false);
    }
  };
};

const loadMatterJS = () => {
  return new Promise((resolve, reject) => {
    if (window.Matter) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Matter.js"));
    document.head.appendChild(script);
  });
};

onMounted(async () => {
  try {
    await loadMatterJS();

    watch(
      () => props.icons,
      async (icons) => {
        if (icons.length === 0) return;
        await nextTick(); // 等 DOM 渲染完
        const cleanup = initSimulation();
        if (cleanup) onUnmounted(cleanup);
      },
      { immediate: true }
    );
  } catch (error) {
    console.error("Failed to initialize simulation:", error);
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.icon-gravity-container {
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: auto;
}

.icon-canvas {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
}

.icon {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.1s ease;
  z-index: 2;
}

.icon-img {
  width: 70%;
  height: 70%;
  object-fit: contain;
  filter: brightness(0.9);
}

/* 不同大小的图标 */
.icon-1,
.icon-2 {
  width: 80px;
  height: 80px;
}

.icon-3,
.icon-4,
.icon-5,
.icon-6 {
  width: 70px;
  height: 70px;
}

.icon-7,
.icon-8,
.icon-9,
.icon-10 {
  width: 65px;
  height: 65px;
}

.icon-11,
.icon-12,
.icon-13,
.icon-14 {
  width: 55px;
  height: 55px;
}

.icon-15,
.icon-16,
.icon-17,
.icon-18,
.icon-19 {
  width: 50px;
  height: 50px;
}

@media (max-width: 640px) {
  .icon {
    width: 50px;
    height: 50px;
  }

  .icon-1,
  .icon-2 {
    width: 65px;
    height: 65px;
  }

  .icon-3,
  .icon-4,
  .icon-5,
  .icon-6 {
    width: 55px;
    height: 55px;
  }

  .icon-7,
  .icon-8,
  .icon-9,
  .icon-10 {
    width: 50px;
    height: 50px;
  }

  .icon-11,
  .icon-12,
  .icon-13,
  .icon-14 {
    width: 45px;
    height: 45px;
  }

  .icon-15,
  .icon-16,
  .icon-17,
  .icon-18,
  .icon-19 {
    width: 40px;
    height: 40px;
  }
}
</style>
