// Utility functions for normalizing and managing product filters (weight, size, volume, etc.)

export function normalizeWeightValue(val) {
    if (!val || typeof val !== 'string') return '';
    let cleaned = val.trim();
    if (!cleaned || cleaned.toLowerCase() === 'default title' || cleaned.toLowerCase() === 'default') {
        return '';
    }

    // Replace multiple spaces with a single space
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // Check for standard number + unit pattern (e.g., "100ml", "100 ml", "12gm", "12 gm", "1kg", "500g")
    const weightMatch = cleaned.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
    if (weightMatch) {
        const num = weightMatch[1];
        const unit = weightMatch[2].toLowerCase();

        if (['ml', 'mls', 'milliliter', 'millilitre'].includes(unit)) {
            return `${num} ml`;
        }
        if (['l', 'ltr', 'ltrs', 'liter', 'litre', 'liters', 'litres'].includes(unit)) {
            return `${num} L`;
        }
        if (['gm', 'gms', 'g', 'gram', 'grams'].includes(unit)) {
            return `${num} gm`;
        }
        if (['kg', 'kgs', 'kilo', 'kilogram', 'kilograms'].includes(unit)) {
            return `${num} kg`;
        }
        if (['mg', 'mgs', 'milligram', 'milligrams'].includes(unit)) {
            return `${num} mg`;
        }
        if (['pc', 'pcs', 'piece', 'pieces'].includes(unit)) {
            return `${num} Pcs`;
        }
        if (['pack', 'packs', 'pkt', 'pkts'].includes(unit)) {
            return `${num} Pack`;
        }
        return `${num} ${weightMatch[2]}`;
    }

    return cleaned;
}

// Helper to extract unique normalized weight/size options from product options and variants
export function getProductWeightValues(node) {
    const values = new Set();
    const targetOptionNames = ['weight', 'size', 'volume', 'net wt', 'net weight', 'quantity'];

    const addVal = (v) => {
        const normalized = normalizeWeightValue(v);
        if (normalized) {
            values.add(normalized);
        }
    };

    // 1. Check options
    const matchedOpt = node?.options?.find(opt =>
        targetOptionNames.includes(opt.name?.toLowerCase().trim())
    );
    if (matchedOpt && Array.isArray(matchedOpt.values)) {
        matchedOpt.values.forEach(v => addVal(v));
    }

    // 2. Check variants
    const variants = Array.isArray(node?.variants)
        ? node.variants
        : (node?.variants?.edges?.map(e => e.node) || []);

    variants.forEach(v => {
        if (v?.title) {
            addVal(v.title);
        }
        if (Array.isArray(v?.selectedOptions)) {
            v.selectedOptions.forEach(opt => {
                if (targetOptionNames.includes(opt.name?.toLowerCase().trim()) || opt.name?.toLowerCase().trim() === 'title') {
                    addVal(opt.value);
                }
            });
        }
    });

    // 3. Fallback: Check any non-default option
    if (values.size === 0 && Array.isArray(node?.options)) {
        node.options.forEach(opt => {
            if (opt.name?.toLowerCase() !== 'title' || (opt.values && opt.values.length > 1)) {
                opt.values?.forEach(v => addVal(v));
            }
        });
    }

    return Array.from(values);
}

// Build and sort available weight filter options
export function buildWeightFilterGroup(allProducts) {
    const weightOptions = new Map();
    allProducts.forEach(({ node }) => {
        const weights = getProductWeightValues(node);
        weights.forEach(val => {
            const currentCount = weightOptions.get(val) || 0;
            weightOptions.set(val, currentCount + 1);
        });
    });

    if (weightOptions.size === 0) return null;

    // Helper for natural sorting (e.g. 12 gm, 100 gm, 500 gm, 1 kg)
    const parseWeightForSort = (str) => {
        const m = str.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/);
        if (!m) return { num: 0, mult: 1 };
        let num = parseFloat(m[1]) || 0;
        let unit = (m[2] || '').toLowerCase();
        let mult = 1;
        if (unit === 'kg' || unit === 'l' || unit === 'ltr') mult = 1000;
        else if (unit === 'mg') mult = 0.001;
        return { num: num * mult };
    };

    const sortedEntries = Array.from(weightOptions.entries()).sort((a, b) => {
        const pA = parseWeightForSort(a[0]);
        const pB = parseWeightForSort(b[0]);
        if (pA.num !== pB.num) return pA.num - pB.num;
        return a[0].localeCompare(b[0], undefined, { numeric: true });
    });

    return {
        id: 'filter.v.option.weight',
        label: 'Weight',
        type: 'LIST',
        values: sortedEntries.map(([label, count]) => ({
            id: `weight-${label.replace(/\s+/g, '-').toLowerCase()}`,
            label: label,
            count: count,
            input: JSON.stringify({ variantOption: { name: 'Weight', value: label } })
        }))
    };
}
