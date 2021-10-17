const Button = {
  // The styles all button have in common
  baseStyle: {
    textTransform: 'uppercase',
    marginBottom: 2,
    // borderRadius: "base", // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: 'sm',
    },
    md: {
      fontSize: 'md',
    },
  },
  // Two variants: outline and solid
  variants: {
    // outline: {
    //   border: "2px solid",
    //   borderColor: "teal",
    //   color: "teal",
    // },
    // solid: {
    //   color: "white",
    // },
  },
  // The default size and variant values
  defaultProps: {
    size: 'lg',
    variant: 'solid',
    colorScheme: 'cyan',
  },
};

export default Button;
