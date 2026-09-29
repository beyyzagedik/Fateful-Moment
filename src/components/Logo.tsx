import { Image } from 'react-native';

type Props = { size?: number };

/**
 * Glowing DNA orb from the Figma app logo, cut out of `app-logo.jpg`
 * with a transparent edge so it sits on any of the dark backgrounds.
 */
export function Logo({ size = 96 }: Props) {
  return (
    <Image
      source={require('../../assets/images/logo-orb.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
      accessibilityLabel="Fateful Moment"
    />
  );
}
