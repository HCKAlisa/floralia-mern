import { useState } from "react";
import {SelectedPage, FaqType} from "../shared/types";
import {motion} from "framer-motion";
import {FaqList} from "../shared/data.ts";
import title from "../assets/Icons/faq-title.png";
import {Card, CardBody, Image} from "@heroui/react";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const Faq = ({setSelectedPage}: Props) => {
    const [dropdownToggledIndex, setDropdownToggledIndex] = useState<number | null>(null);
    const handleDropdownToggle = (index: number): void => {
        if (index === dropdownToggledIndex) {
            setDropdownToggledIndex(null);
            return;
        }
        setDropdownToggledIndex(index);
    }
    return (
        <section id="faq">
            <motion.div
                className=""
                onViewportEnter={() => setSelectedPage(SelectedPage.FAQ)}
            >
                <div
                    className="mx-auto flex flex-col items-center justify-center xl:w-full w-11/12"
                    // initial="hidden"
                    // whileInView="visible"
                    // viewport={{once:true, amount: 0.5}}
                    // transition={{ duration: 0.5 }}
                    // variants={{
                    //     hidden: { opacity: 0, y: 50},
                    //     visible: {opacity: 1, y: 0}
                    // }}
                >
                    <Image
                        alt="FAQ Title"
                        src={title}
                        removeWrapper
                        className="mx-auto w-1/2 xl:w-1/4"
                    />
                    <div className="xl:w-4/5 w-11/12 justify-center items-center grid xl:grid-cols-2 gap-6 m-auto">
                        { FaqList.map((item: FaqType, index: number) => (
                            <div key={`faq-${index}`} className="">
                                {dropdownToggledIndex!==index ? (
                                    <Card key={index} isPressable shadow="sm" onPress={() => handleDropdownToggle(index)} className="aspect-2/1 rounded-lg shadow-lg" fullWidth >
                                        <CardBody className={`${item.bgColor}`} style={{ color: item.color }}>
                                            <h6 className="text-xl xl:text-4xl 2xl:text-5xl p-4">{item.question}</h6>
                                        </CardBody>
                                    </Card>
                                ) : (
                                    <Card key={index} isPressable shadow="sm" onPress={() => handleDropdownToggle(index)} className="aspect-2/1 rounded-lg shadow-lg" fullWidth>
                                        <CardBody className={`${item.bgColor}`} style={{ color: item.color }}>
                                            <h6 className="text-xl xl:text-4xl 2xl:text-5xl p-4">{item.answer}</h6>
                                        </CardBody>
                                    </Card>
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
export default Faq
