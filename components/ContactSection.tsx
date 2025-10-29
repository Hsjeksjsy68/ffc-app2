import React from 'react';
import { EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, TwitterIcon, FacebookIcon, InstagramIcon } from './Icons';

const ContactInfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-4 p-4 bg-brand-dark/50 rounded-lg">
        <div className="flex-shrink-0 text-brand-orange mt-1">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-gray-300">{title}</h3>
            <div className="text-white break-words">{children}</div>
        </div>
    </div>
);

const SocialLink = ({ icon, href, 'aria-label': ariaLabel }: { icon: React.ReactNode, href: string, 'aria-label': string }) => (
    <a href={href} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-orange transition-colors duration-200">
        {icon}
    </a>
);

const ContactSection: React.FC = () => {
    return (
        <div className="animate-fade-in space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-brand-orange">Get In Touch</h2>
                <p className="text-gray-300 mt-2">We'd love to hear from you. Here's how you can reach us.</p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-brand-gray p-6 sm:p-8 rounded-lg shadow-xl space-y-6">
                    <ContactInfoCard
                        icon={<EnvelopeIcon className="h-6 w-6" />}
                        title="General Inquiries"
                    >
                        <a href="mailto:flamehunterfc@hotmail.com" className="hover:underline">flamehunterfc@hotmail.com</a>
                    </ContactInfoCard>

                    <ContactInfoCard
                        icon={<PhoneIcon className="h-6 w-6" />}
                        title="Ticket Office"
                    >
                        <a href="tel:+8801922158666" className="hover:underline">+8801922158666</a>
                    </ContactInfoCard>

                    <ContactInfoCard
                        icon={<BuildingOfficeIcon className="h-6 w-6" />}
                        title="Club Address"
                    >
                        <p>Road 15, Block K</p>
                        <p>South Banasree</p>
                        <p>Dhaka 1219, Bangladesh</p>
                    </ContactInfoCard>

                    <div className="border-t border-gray-700 my-6"></div>

                    <div className="text-center">
                        <h3 className="font-semibold text-gray-300 mb-4">Follow Us on Social Media</h3>
                        <div className="flex justify-center items-center gap-6">
                            <SocialLink href="https://twitter.com/flamehunterfc" aria-label="Follow us on Twitter" icon={<TwitterIcon className="h-7 w-7" />} />
                            <SocialLink href="https://facebook.com/flamehunterfc" aria-label="Follow us on Facebook" icon={<FacebookIcon className="h-7 w-7" />} />
                            <SocialLink href="https://instagram.com/flamehunterfc" aria-label="Follow us on Instagram" icon={<InstagramIcon className="h-7 w-7" />} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;