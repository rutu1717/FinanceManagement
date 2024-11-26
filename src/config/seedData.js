const Service = require('../models/Service');

const services = [
    {
        type: "Home Loan",
        code: "HL",
        description: "Get your dream home with our affordable home loans",
        imgUrl: "home-loan.jpg",
        detail: [
            "Up to 80% financing",
            "Competitive interest rates",
            "Quick approval",
            "Flexible tenure options",
            "Minimal documentation"
        ]
    },
    {
        type: "Personal Loan",
        code: "PL",
        description: "Quick personal loans for your immediate needs",
        imgUrl: "personal-loan.jpg",
        detail: [
            "No collateral required",
            "Quick disbursement",
            "Flexible repayment options",
            "Competitive interest rates",
            "Minimal documentation"
        ]
    },
    {
        type: "Business Loan",
        code: "BL",
        description: "Grow your business with our flexible business loans",
        imgUrl: "business-loan.jpg",
        detail: [
            "High loan amounts",
            "Customized repayment options",
            "Quick processing",
            "Minimal documentation",
            "Competitive rates"
        ]
    }
];

const seedDatabase = async () => {
    try {
        // Clear existing services
        await Service.deleteMany({});
        
        // Insert new services
        await Service.insertMany(services);
        
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;