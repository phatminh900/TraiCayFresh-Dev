import { ReactNode } from "react";
import {
  IoLeafOutline,
  IoRestaurantOutline,
  IoScaleOutline,
  IoRibbonOutline,
} from "react-icons/io5";

const BENEFITS = [
  { title: "Sạch", description: "Đảm bảo an toàn 100%", icon: <IoLeafOutline  className="text-primary/80" size={30}/> },
  { title: "Ngon", description: "Hương vị thơm ngon", icon: <IoRestaurantOutline className="text-primary/80"  size={30}/> },
  {
    title: "Dinh dưỡng",
    description: "Dinh dưỡng dồi dào",
    icon: <IoScaleOutline className="text-primary/80"  size={30}/>,
  },
  { title: "Chất lượng", description: "Đảm bảo uy tín", icon: <IoRibbonOutline className="text-primary/80"  size={30}/> },
];
const BenefitsSection = () => {
  return (
    <div className='flex items-center justify-between'>
      {BENEFITS.map((benefit) => (
        <BenefitItem
          title={benefit.title}
          description={benefit.description}
          icon={benefit.icon}
          key={benefit.title}
        />
      ))}
    </div>
  );
};

export default BenefitsSection;

interface BenefitItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}
function BenefitItem({ icon, title, description }: BenefitItemProps) {
  return (
    <div className='flex-center flex-col gap-2 '>
      <div className='h-16 w-16 bg-primary/20 rounded-full flex-center'>{icon}</div>
      <p className='font-bold'>{title}</p>
      <p className="mt-2 text-center">{description}</p>
    </div>
  );
}
