package com.electricity;

import java.util.ArrayList;
import java.util.List;

public class BillCalculator {

    private static final Object[][] SLABS = {
        { 50.0, 3.50, "First 50 units" },
        { 100.0, 4.00, "Next 100 units (51 - 150)" },
        { 100.0, 5.20, "Next 100 units (151 - 250)" },
        { Double.MAX_VALUE, 6.50, "Above 250 units" }
    };

    public static BillResult calculate(double units) {
        List<SlabDetail> details = new ArrayList<SlabDetail>();
        double remaining = units;
        double total = 0.0;

        for (Object[] slab : SLABS) {
            if (remaining <= 0) {
                break;
            }
            double limit = (Double) slab[0];
            double rate = (Double) slab[1];
            String label = (String) slab[2];

            double used = Math.min(remaining, limit);
            double amount = used * rate;
            total += amount;
            details.add(new SlabDetail(label, used, rate, amount));
            remaining -= used;
        }

        return new BillResult(details, total);
    }

    public static class SlabDetail {
        private final String label;
        private final double units;
        private final double rate;
        private final double amount;

        public SlabDetail(String label, double units, double rate, double amount) {
            this.label = label;
            this.units = units;
            this.rate = rate;
            this.amount = amount;
        }

        public String getLabel() { return label; }
        public double getUnits() { return units; }
        public double getRate() { return rate; }
        public double getAmount() { return amount; }
    }

    public static class BillResult {
        private final List<SlabDetail> slabs;
        private final double total;

        public BillResult(List<SlabDetail> slabs, double total) {
            this.slabs = slabs;
            this.total = total;
        }

        public List<SlabDetail> getSlabs() { return slabs; }
        public double getTotal() { return total; }
    }
}