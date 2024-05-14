import { useEffect, useRef, useState } from "react";
import { motion, useCycle } from "framer-motion";
import classes from "./SideNav.module.css";
import MenuToggle from "./MenuToggle";

const sidebar = {
  open: (height = 120) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      // type: "spring", // causes an error
      stiffness: 20,
      restDelta: 2,
      duration: 1,
    },
  }),
  closed: {
    clipPath: "circle(15px at 32px 28px)",
    transition: {
      delay: 0.5,
      // type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const useDimensions = (ref: React.MutableRefObject<HTMLElement | null>) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    dimensions.current.width = ref.current!.offsetWidth;
    dimensions.current.height = ref.current!.offsetHeight;
  }, []);

  return dimensions.current;
};

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export default function SideNav({ children }: { children: React.ReactNode }) {
  const [isOpen, toggleOpen] = useCycle(true, false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRenderChildren, setShouldRenderChildren] = useState(true);
  const ref = useRef(null);
  const { height } = useDimensions(ref);

  const handleSetAnimation = () => {
    setIsAnimating((prevState) => !prevState);
  };

  const onAnimationComplete = () => {
    if (!isOpen) {
      setShouldRenderChildren(false);
    }
    handleSetAnimation();
  };

  function handleToggle() {
    toggleOpen();
    if (!isOpen) {
      setShouldRenderChildren(true);
    }
  }

  return (
    <motion.nav
      initial={isOpen ? "closed" : "open"}
      animate={isOpen ? "open" : "closed"}
      variants={variants}
      custom={height}
      ref={ref}
      className={classes.nav}
    >
      <motion.div
        className={classes.background}
        variants={sidebar}
        onAnimationStart={handleSetAnimation}
        onAnimationComplete={onAnimationComplete}
      />
      <MenuToggle toggle={handleToggle} disable={isAnimating} />
      {shouldRenderChildren && children}
    </motion.nav>
  );
}
