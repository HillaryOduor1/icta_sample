import React, { useState, useEffect } from 'react';
import {
    Save, RefreshCw, Palette, Layout, Globe, Shield, Type,
    Monitor, Bell, Database, Download, Upload, Check, Sun, Moon, Zap,
    Eye, EyeOff, ChevronDown, X, AlertCircle, Code, Smartphone, Tablet
} from 'lucide-react';

const API_BASE = '/api/v1';

const DEFAULT_SETTINGS = {
    version: 1,
    theme: {
        mode: 'light',
        primaryColor: '#db2777',
        secondaryColor: '#ec4899',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        borderRadius: 'medium',
        shadows: true,
        animations: true,
    },
    typography: {
        fontFamily: 'system',
        customFont: '',
        fontSize: 'normal',
        lineHeight: 1.5,
        letterSpacing: 'normal',
        bodyWeight: 'normal',
        headingWeight: 'bold',
        headingScale: 'normal',
        textAlign: 'left',
    },
    ui: {
        density: 'comfortable',
        buttonStyle: 'filled',
        animations: 'full',
    },
    data: {
        autoSave: true,
        saveInterval: 5,
        exportFormat: 'json',
        backupEnabled: true,
    },
    notifications: {
        enabled: true,
        sound: true,
        desktopNotifications: false,
        frequency: 'instant',
        emailNotifications: true,
        pushNotifications: false,
        categories: ['security', 'updates'],
    },
    accessibility: {
        reducedMotion: false,
        highContrast: false,
        focusVisible: true,
        textScale: 1.0,
        dyslexiaFriendly: false,
        largerText: false,
        soundCues: false,
        focusIndicators: true,
        colorVision: 'default',
    },
    site: {
        title: 'LIS - Landscape Integrity Solutions',
        description: 'Advancing Policy for Sustainable Landscapes',
        logo: '',
        favicon: '',
        metaKeywords: 'think tank, environmental policy, sustainability, research',
    },
    lastUpdated: new Date().toISOString(),
};

/* ==================== UTILITY COMPONENTS ==================== */

function Toggle({ checked, onChange, id, disabled }) {
    return (
        <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <input
                type="checkbox"
                className="sr-only peer"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            <div className={`
                w-11 h-6 rounded-full peer 
                ${checked ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'}
                peer-focus:ring-2 peer-focus:ring-accent/50
                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                after:bg-white after:border-gray-300 after:border after:rounded-full
                after:h-5 after:w-5 after:transition-all
                peer-checked:after:translate-x-full peer-checked:after:border-white
            `}></div>
        </label>
    );
}

function Row({ label, description, children }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border last:border-0">
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground">{label}</div>
                {description && <div className="text-xs text-muted mt-0.5">{description}</div>}
            </div>
            <div className="flex-shrink-0">{children}</div>
        </div>
    );
}

function Select({ value, onChange, options }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-base px-3 py-1.5 text-sm rounded-lg cursor-pointer min-w-[140px]"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
}

function SectionHeader({ title, description, icon: Icon }) {
    return (
        <div className="mb-6 pb-4 border-b border-border flex items-center gap-3">
            {Icon && <Icon size={20} className="text-accent" />}
            <div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                {description && <p className="text-sm text-muted mt-1">{description}</p>}
            </div>
        </div>
    );
}

function ColorPicker({ label, value, onChange }) {
    return (
        <div className="flex items-center gap-3">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-border"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-base flex-1 px-3 py-1.5 text-sm font-mono"
                placeholder="#000000"
            />
        </div>
    );
}

function Range({ value, onChange, min, max, step, label }) {
    return (
        <div className="flex items-center gap-3">
            <input
                type="range"
                min={min || 0}
                max={max || 100}
                step={step || 1}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-32 accent-accent"
            />
            <span className="text-sm text-muted min-w-[40px]">{value}{label}</span>
        </div>
    );
}

function Badge({ children, color }) {
    return (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>
            {children}
        </span>
    );
}

function PreviewCard({ children, className }) {
    return (
        <div className={`p-4 rounded-lg border border-border bg-surface/50 ${className}`}>
            {children}
        </div>
    );
}

/* ==================== TAB COMPONENTS ==================== */

function AppearanceTab({ settings, onChange }) {
    const theme = settings.theme || DEFAULT_SETTINGS.theme;

    const colorPresets = [
        { name: 'Pink', primary: '#db2777', secondary: '#ec4899' },
        { name: 'Blue', primary: '#2563eb', secondary: '#3b82f6' },
        { name: 'Purple', primary: '#7c3aed', secondary: '#8b5cf6' },
        { name: 'Teal', primary: '#0d9488', secondary: '#14b8a6' },
        { name: 'Green', primary: '#059669', secondary: '#10b981' },
        { name: 'Orange', primary: '#ea580c', secondary: '#f97316' },
        { name: 'Red', primary: '#dc2626', secondary: '#ef4444' },
        { name: 'Indigo', primary: '#6366f1', secondary: '#818cf8' },
    ];

    const themeOptions = [
        { id: 'light', label: 'Light', icon: Sun },
        { id: 'dark', label: 'Dark', icon: Moon },
        { id: 'system', label: 'System', icon: Monitor },
    ];

    const radiusOptions = [
        { id: 'small', label: 'Sharp', value: '0.25rem' },
        { id: 'medium', label: 'Rounded', value: '0.5rem' },
        { id: 'large', label: 'Pill', value: '1rem' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <SectionHeader title="Theme Mode" description="Select the primary interface color scheme" icon={Monitor} />
            
            <div className="grid grid-cols-3 gap-3 mb-8">
                {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = theme.mode === opt.id;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onChange('theme', { ...theme, mode: opt.id })}
                            className={`
                                flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                                ${isActive 
                                    ? 'border-accent bg-accent/5 text-accent' 
                                    : 'border-border text-muted hover:border-muted hover:bg-surface'
                                }
                            `}
                        >
                            <Icon size={24} />
                            <span className="text-sm font-medium">{opt.label}</span>
                        </button>
                    );
                })}
            </div>

            <SectionHeader title="Color Palette" description="Choose brand colors for the frontend" icon={Palette} />
            
            <div className="flex flex-wrap gap-2 mb-6">
                {colorPresets.map((p) => {
                    const isActive = theme.primaryColor === p.primary;
                    return (
                        <button
                            key={p.name}
                            onClick={() => onChange('theme', { ...theme, primaryColor: p.primary, secondaryColor: p.secondary })}
                            title={p.name}
                            className={`
                                flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all
                                ${isActive ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface'}
                            `}
                        >
                            <span className="w-3.5 h-3.5 rounded-full" style={{ background: p.primary }} />
                            {p.name}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PreviewCard>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-3 block">
                        Primary Color
                    </label>
                    <ColorPicker
                        value={theme.primaryColor}
                        onChange={(v) => onChange('theme', { ...theme, primaryColor: v })}
                    />
                </PreviewCard>
                <PreviewCard>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-3 block">
                        Secondary Color
                    </label>
                    <ColorPicker
                        value={theme.secondaryColor}
                        onChange={(v) => onChange('theme', { ...theme, secondaryColor: v })}
                    />
                </PreviewCard>
                <PreviewCard>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-3 block">
                    Text Color
                    </label>
                    <ColorPicker
                    value={theme.textColor || '#0f172a'}
                    onChange={(v) => onChange('theme', { ...theme, textColor: v })}
                    />
                </PreviewCard>
            </div>

            <SectionHeader title="Shape & Visual" description="Border radius and visual effects" icon={Layout} />
            
            <div className="grid grid-cols-3 gap-3 mb-6">
                {radiusOptions.map((opt) => {
                    const isActive = theme.borderRadius === opt.id;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onChange('theme', { ...theme, borderRadius: opt.id })}
                            className={`
                                flex flex-col items-center gap-2 p-4 border-2 transition-all
                                ${isActive ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface'}
                            `}
                            style={{ borderRadius: opt.value }}
                        >
                            <div className="w-8 h-8 border-2 border-current" style={{ borderRadius: opt.value }} />
                            <span className="text-sm font-medium">{opt.label}</span>
                        </button>
                    );
                })}
            </div>

            <PreviewCard className="space-y-0">
                <Row label="Drop Shadows" description="Layered shadows for depth and elevation">
                    <Toggle 
                        id="shadows" 
                        checked={theme.shadows} 
                        onChange={(v) => onChange('theme', { ...theme, shadows: v })} 
                    />
                </Row>
                <Row label="Animations" description="Smooth UI transitions and micro-interactions">
                    <Toggle 
                        id="animations" 
                        checked={theme.animations} 
                        onChange={(v) => onChange('theme', { ...theme, animations: v })} 
                    />
                </Row>
            </PreviewCard>

            {/* Live Preview */}
            <PreviewCard className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Live Preview</h4>
                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: theme.backgroundColor }}>
                    <button 
                        className="px-4 py-2 rounded text-sm font-medium text-white"
                        style={{ background: theme.primaryColor, borderRadius: radiusOptions.find(r => r.id === theme.borderRadius)?.value }}
                    >
                        Primary Button
                    </button>
                    <button 
                        className="px-4 py-2 rounded text-sm font-medium border"
                        style={{ 
                            borderColor: theme.secondaryColor,
                            color: theme.secondaryColor,
                            borderRadius: radiusOptions.find(r => r.id === theme.borderRadius)?.value
                        }}
                    >
                        Secondary Button
                    </button>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: theme.backgroundColor, color: theme.textColor }}>
                    {/* Primary button (unchanged) */}
                    <button 
                        className="px-4 py-2 rounded text-sm font-medium text-white"
                        style={{ background: theme.primaryColor, borderRadius: radiusOptions.find(r => r.id === theme.borderRadius)?.value }}
                    >
                        Primary Button
                    </button>
                    {/* Secondary button text color uses theme.secondaryColor – but we can also show theme.textColor in a paragraph */}
                    <p className="text-sm">Sample text with selected text color.</p>
                    </div>
            </PreviewCard>
        </div>
    );
}

function TypographyTab({ settings, onChange }) {
    const typo = settings.typography || DEFAULT_SETTINGS.typography;

    const fontFamilyOptions = [
        { value: 'system', label: 'System Default' },
        { value: 'inter', label: 'Inter (Modern)' },
        { value: 'serif', label: 'Serif (Georgia)' },
        { value: 'monospace', label: 'Monospace' },
        { value: 'custom', label: 'Custom Font' },
    ];

    const fontSizeOptions = [
        { value: 'small', label: 'Small (14px)' },
        { value: 'normal', label: 'Normal (16px)' },
        { value: 'large', label: 'Large (18px)' },
        { value: 'xlarge', label: 'XL (20px)' },
    ];

    const weightOptions = [
        { value: 'normal', label: 'Regular (400)' },
        { value: 'medium', label: 'Medium (500)' },
        { value: 'semibold', label: 'Semibold (600)' },
        { value: 'bold', label: 'Bold (700)' },
        { value: 'extrabold', label: 'Extra Bold (800)' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <SectionHeader title="Typography" description="Font family, size, and text rendering" icon={Type} />

            <PreviewCard className="space-y-0">
                <Row label="Font Family" description="Global typeface for the site">
                    <Select
                        value={typo.fontFamily}
                        onChange={(v) => onChange('typography', { ...typo, fontFamily: v })}
                        options={fontFamilyOptions}
                    />
                </Row>

                {typo.fontFamily === 'custom' && (
                    <Row label="Custom Font URL" description="Enter your custom font CSS URL or @import">
                        <input
                            type="text"
                            value={typo.customFont || ''}
                            onChange={(e) => onChange('typography', { ...typo, customFont: e.target.value })}
                            placeholder="https://fonts.googleapis.com/css2?family=..."
                            className="input-base flex-1 px-3 py-1.5 text-sm rounded-lg w-full sm:w-64"
                        />
                    </Row>
                )}

                <Row label="Font Size" description="Base font size used across the site">
                    <Select
                        value={typo.fontSize}
                        onChange={(v) => onChange('typography', { ...typo, fontSize: v })}
                        options={fontSizeOptions}
                    />
                </Row>

                <Row label="Line Height" description="Space between lines of text">
                    <Range
                        value={typo.lineHeight}
                        onChange={(v) => onChange('typography', { ...typo, lineHeight: v })}
                        min={1}
                        max={2}
                        step={0.1}
                        label="x"
                    />
                </Row>

                <Row label="Letter Spacing" description="Space between individual characters">
                    <Select
                        value={typo.letterSpacing}
                        onChange={(v) => onChange('typography', { ...typo, letterSpacing: v })}
                        options={[
                            { value: 'tight', label: 'Tight (-0.025em)' },
                            { value: 'normal', label: 'Normal (0)' },
                            { value: 'wide', label: 'Wide (0.025em)' },
                        ]}
                    />
                </Row>

                <Row label="Text Alignment" description="Default text alignment">
                    <Select
                        value={typo.textAlign}
                        onChange={(v) => onChange('typography', { ...typo, textAlign: v })}
                        options={[
                            { value: 'left', label: 'Left' },
                            { value: 'center', label: 'Center' },
                            { value: 'right', label: 'Right' },
                            { value: 'justify', label: 'Justify' },
                        ]}
                    />
                </Row>

                <Row label="Body Weight" description="Font weight for body text">
                    <Select
                        value={typo.bodyWeight}
                        onChange={(v) => onChange('typography', { ...typo, bodyWeight: v })}
                        options={weightOptions.slice(0, 4)}
                    />
                </Row>

                <Row label="Heading Weight" description="Font weight for headings">
                    <Select
                        value={typo.headingWeight}
                        onChange={(v) => onChange('typography', { ...typo, headingWeight: v })}
                        options={weightOptions}
                    />
                </Row>

                <Row label="Heading Scale" description="Size progression for headings">
                    <Select
                        value={typo.headingScale}
                        onChange={(v) => onChange('typography', { ...typo, headingScale: v })}
                        options={[
                            { value: 'compact', label: 'Compact' },
                            { value: 'normal', label: 'Normal' },
                            { value: 'relaxed', label: 'Relaxed' },
                        ]}
                    />
                </Row>
            </PreviewCard>

            {/* Typography Preview */}
            <PreviewCard>
                <h4 className="text-sm font-semibold mb-4">Typography Preview</h4>
                <div className="space-y-4" style={{ fontFamily: typo.fontFamily === 'custom' ? typo.customFont : undefined }}>
                    <h1 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: typo.headingWeight === 'normal' ? '400' : 
                                  typo.headingWeight === 'medium' ? '500' :
                                  typo.headingWeight === 'semibold' ? '600' :
                                  typo.headingWeight === 'bold' ? '700' : '800'
                    }}>
                        Heading 1 - The Quick Brown Fox
                    </h1>
                    <h2 style={{ fontSize: '2rem', fontWeight: '600' }}>Heading 2 - Jumps Over The Lazy Dog</h2>
                    <p style={{ 
                        fontSize: typo.fontSize === 'small' ? '0.875rem' :
                                 typo.fontSize === 'normal' ? '1rem' :
                                 typo.fontSize === 'large' ? '1.125rem' : '1.25rem',
                        lineHeight: typo.lineHeight,
                        letterSpacing: typo.letterSpacing === 'tight' ? '-0.025em' :
                                      typo.letterSpacing === 'normal' ? '0' : '0.025em',
                        textAlign: typo.textAlign
                    }}>
                        Body text preview. This is how your paragraphs will look with the selected typography settings.
                        The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
                    </p>
                </div>
            </PreviewCard>
        </div>
    );
}

function UITab({ settings, onChange }) {
    const ui = settings.ui || DEFAULT_SETTINGS.ui;

    const densityOptions = [
        { value: 'compact', label: 'Compact - Less spacing' },
        { value: 'comfortable', label: 'Comfortable - Balanced' },
        { value: 'spacious', label: 'Spacious - More breathing room' },
    ];

    const buttonStyleOptions = [
        { value: 'filled', label: 'Filled' },
        { value: 'outline', label: 'Outline' },
        { value: 'ghost', label: 'Ghost' },
        { value: 'rounded', label: 'Rounded' },
        { value: 'pill', label: 'Pill' },
        { value: 'square', label: 'Square' },
    ];

    const animationOptions = [
        { value: 'full', label: 'Full Animations' },
        { value: 'reduced', label: 'Reduced Motion' },
        { value: 'none', label: 'Disabled' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <SectionHeader title="UI & Layout" description="Density, button styles, and spacing" icon={Layout} />

            <PreviewCard className="space-y-0">
                <Row label="UI Density" description="Spacing and sizing of interface elements">
                    <Select
                        value={ui.density}
                        onChange={(v) => onChange('ui', { ...ui, density: v })}
                        options={densityOptions}
                    />
                </Row>

                <Row label="Button Style" description="Default button shape across the site">
                    <Select
                        value={ui.buttonStyle}
                        onChange={(v) => onChange('ui', { ...ui, buttonStyle: v })}
                        options={buttonStyleOptions}
                    />
                </Row>

                <Row label="Animations" description="Motion effects and transitions">
                    <Select
                        value={ui.animations}
                        onChange={(v) => onChange('ui', { ...ui, animations: v })}
                        options={animationOptions}
                    />
                </Row>
            </PreviewCard>

            {/* UI Preview */}
            <PreviewCard>
                <h4 className="text-sm font-semibold mb-4">UI Preview</h4>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                        {['Default', 'Primary', 'Secondary'].map((text, i) => (
                            <button
                                key={i}
                                className={`
                                    px-4 py-2 text-sm font-medium transition-all
                                    ${ui.buttonStyle === 'filled' ? 'bg-accent text-white' : ''}
                                    ${ui.buttonStyle === 'outline' ? 'border border-accent text-accent bg-transparent' : ''}
                                    ${ui.buttonStyle === 'ghost' ? 'text-accent hover:bg-accent/10' : ''}
                                    ${ui.buttonStyle === 'rounded' ? 'bg-accent text-white rounded-full' : ''}
                                    ${ui.buttonStyle === 'pill' ? 'bg-accent text-white rounded-full px-6' : ''}
                                    ${ui.buttonStyle === 'square' ? 'bg-accent text-white rounded-none' : ''}
                                    ${ui.buttonStyle === 'filled' && ui.density === 'compact' ? 'px-3 py-1 text-xs' : ''}
                                    ${ui.buttonStyle === 'filled' && ui.density === 'spacious' ? 'px-6 py-3 text-base' : ''}
                                `}
                            >
                                {text} Button
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4 p-4 border border-border rounded-lg">
                        <div className={`flex gap-2 ${ui.density === 'compact' ? 'space-x-1' : ui.density === 'spacious' ? 'space-x-4' : 'space-x-2'}`}>
                            <div className="w-8 h-8 bg-accent/20 rounded"></div>
                            <div className="w-8 h-8 bg-accent/40 rounded"></div>
                            <div className="w-8 h-8 bg-accent/60 rounded"></div>
                            <div className="w-8 h-8 bg-accent/80 rounded"></div>
                        </div>
                        <span className="text-sm text-muted">Density: {ui.density}</span>
                    </div>
                </div>
            </PreviewCard>
        </div>
    );
}

function SiteTab({ settings, onChange }) {
    const site = settings.site || DEFAULT_SETTINGS.site;

    return (
        <div className="space-y-8 animate-fade-in">
            <SectionHeader title="Site Information" description="Global metadata displayed on the public site" icon={Globe} />

            <PreviewCard className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Site Title</label>
                    <input
                        type="text"
                        value={site.title || ''}
                        onChange={(e) => onChange('site', { ...site, title: e.target.value })}
                        placeholder="My Awesome Site"
                        className="input-base w-full px-3 py-2 text-sm rounded-lg"
                    />
                    <p className="text-xs text-muted mt-1">Used in browser title bar and SEO</p>
                </div>

                <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Meta Description</label>
                    <textarea
                        rows={3}
                        value={site.description || ''}
                        onChange={(e) => onChange('site', { ...site, description: e.target.value })}
                        placeholder="Describe your site for SEO..."
                        className="input-base w-full px-3 py-2 text-sm rounded-lg resize-none"
                    />
                    <p className="text-xs text-muted mt-1">Recommended: 150-160 characters</p>
                </div>

                <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Meta Keywords</label>
                    <input
                        type="text"
                        value={site.metaKeywords || ''}
                        onChange={(e) => onChange('site', { ...site, metaKeywords: e.target.value })}
                        placeholder="think tank, policy, research, sustainability"
                        className="input-base w-full px-3 py-2 text-sm rounded-lg"
                    />
                    <p className="text-xs text-muted mt-1">Comma-separated keywords</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-foreground block mb-2">Logo URL</label>
                        <input
                            type="text"
                            value={site.logo || ''}
                            onChange={(e) => onChange('site', { ...site, logo: e.target.value })}
                            placeholder="/assets/logo.svg"
                            className="input-base w-full px-3 py-2 text-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-foreground block mb-2">Favicon URL</label>
                        <input
                            type="text"
                            value={site.favicon || ''}
                            onChange={(e) => onChange('site', { ...site, favicon: e.target.value })}
                            placeholder="/favicon.ico"
                            className="input-base w-full px-3 py-2 text-sm rounded-lg"
                        />
                    </div>
                </div>
            </PreviewCard>

            {/* SEO Preview */}
            <PreviewCard>
                <h4 className="text-sm font-semibold mb-3">Search Engine Preview</h4>
                <div className="p-4 border border-border rounded-lg bg-white dark:bg-gray-800">
                    <div className="text-blue-600 dark:text-blue-400 text-lg font-medium truncate">
                        {site.title || 'Site Title'}
                    </div>
                    <div className="text-green-700 dark:text-green-500 text-sm truncate">
                        https://yourdomain.com
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                        {site.description || 'Site description will appear here...'}
                    </div>
                </div>
            </PreviewCard>
        </div>
    );
}

function NotificationsTab({ settings, onChange }) {
    const notif = settings.notifications || DEFAULT_SETTINGS.notifications;

    const categoryOptions = [
        { value: 'security', label: 'Security Alerts' },
        { value: 'updates', label: 'System Updates' },
        { value: 'content', label: 'Content Changes' },
        { value: 'users', label: 'User Activity' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <SectionHeader title="Notifications" description="Control notification preferences" icon={Bell} />

            <PreviewCard className="space-y-0">
                <Row label="Enable Notifications" description="Turn all notifications on or off">
                    <Toggle 
                        id="notif-enabled" 
                        checked={notif.enabled} 
                        onChange={(v) => onChange('notifications', { ...notif, enabled: v })} 
                    />
                </Row>

                <Row label="Sound Alerts" description="Play a sound on new notifications">
                    <Toggle 
                        id="notif-sound" 
                        checked={notif.sound} 
                        onChange={(v) => onChange('notifications', { ...notif, sound: v })} 
                        disabled={!notif.enabled}
                    />
                </Row>

                <Row label="Desktop Notifications" description="Show browser notifications">
                    <Toggle 
                        id="notif-desktop" 
                        checked={notif.desktopNotifications} 
                        onChange={(v) => onChange('notifications', { ...notif, desktopNotifications: v })} 
                        disabled={!notif.enabled}
                    />
                </Row>

                <Row label="Email Notifications" description="Get updates via email">
                    <Toggle 
                        id="notif-email" 
                        checked={notif.emailNotifications} 
                        onChange={(v) => onChange('notifications', { ...notif, emailNotifications: v })} 
                        disabled={!notif.enabled}
                    />
                </Row>

                <Row label="Push Notifications" description="Receive push notifications on your device">
                    <Toggle 
                        id="notif-push" 
                        checked={notif.pushNotifications} 
                        onChange={(v) => onChange('notifications', { ...notif, pushNotifications: v })} 
                        disabled={!notif.enabled}
                    />
                </Row>

                <Row label="Notification Frequency" description="How often to send notification digests">
                    <Select
                        value={notif.frequency}
                        onChange={(v) => onChange('notifications', { ...notif, frequency: v })}
                        options={[
                            { value: 'instant', label: 'Instant' },
                            { value: 'daily', label: 'Daily Digest' },
                            { value: 'weekly', label: 'Weekly Summary' },
                        ]}
                        disabled={!notif.enabled}
                    />
                </Row>

                <Row label="Notification Categories" description="Which types of notifications to receive">
                    <div className="flex flex-wrap gap-2">
                        {categoryOptions.map((cat) => (
                            <label key={cat.value} className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notif.categories?.includes(cat.value)}
                                    onChange={(e) => {
                                        const current = notif.categories || [];
                                        const updated = e.target.checked
                                            ? [...current, cat.value]
                                            : current.filter(c => c !== cat.value);
                                        onChange('notifications', { ...notif, categories: updated });
                                    }}
                                    disabled={!notif.enabled}
                                    className="accent-accent"
                                />
                                <span className="text-xs text-foreground">{cat.label}</span>
                            </label>
                        ))}
                    </div>
                </Row>
            </PreviewCard>
        </div>
    );
}

function AccessibilityTab({ settings, onChange }) {
    const a11y = settings.accessibility || DEFAULT_SETTINGS.accessibility;

    return (
        <div className="space-y-8 animate-fade-in">
            <SectionHeader title="Accessibility" description="Make the site usable for everyone" icon={Zap} />

            <PreviewCard className="space-y-0">
                <Row label="Reduced Motion" description="Minimize animations for motion-sensitive users">
                    <Toggle 
                        id="a11y-motion" 
                        checked={a11y.reducedMotion} 
                        onChange={(v) => onChange('accessibility', { ...a11y, reducedMotion: v })} 
                    />
                </Row>

                <Row label="High Contrast" description="Increase color contrast for better visibility">
                    <Toggle 
                        id="a11y-contrast" 
                        checked={a11y.highContrast} 
                        onChange={(v) => onChange('accessibility', { ...a11y, highContrast: v })} 
                    />
                </Row>

                <Row label="Focus Indicators" description="Show visible keyboard focus outlines">
                    <Toggle 
                        id="a11y-focus" 
                        checked={a11y.focusIndicators} 
                        onChange={(v) => onChange('accessibility', { ...a11y, focusIndicators: v })} 
                    />
                </Row>

                <Row label="Dyslexia-Friendly Font" description="Use OpenDyslexic font for readability">
                    <Toggle 
                        id="a11y-dyslexia" 
                        checked={a11y.dyslexiaFriendly} 
                        onChange={(v) => onChange('accessibility', { ...a11y, dyslexiaFriendly: v })} 
                    />
                </Row>

                <Row label="Larger Text" description="Increase default text size">
                    <Toggle 
                        id="a11y-large" 
                        checked={a11y.largerText} 
                        onChange={(v) => onChange('accessibility', { ...a11y, largerText: v })} 
                    />
                </Row>

                <Row label="Sound Cues" description="Play sounds for important actions">
                    <Toggle 
                        id="a11y-sound" 
                        checked={a11y.soundCues} 
                        onChange={(v) => onChange('accessibility', { ...a11y, soundCues: v })} 
                    />
                </Row>

                <Row label="Color Vision Mode" description="Adjust colors for color vision deficiencies">
                    <Select
                        value={a11y.colorVision}
                        onChange={(v) => onChange('accessibility', { ...a11y, colorVision: v })}
                        options={[
                            { value: 'default', label: 'Default' },
                            { value: 'protanopia', label: 'Protanopia (red-blind)' },
                            { value: 'deuteranopia', label: 'Deuteranopia (green-blind)' },
                            { value: 'tritanopia', label: 'Tritanopia (blue-blind)' },
                            { value: 'achromatopsia', label: 'Achromatopsia (grayscale)' },
                        ]}
                    />
                </Row>

                <Row label="Text Scale" description="Adjust overall text size">
                    <Range
                        value={a11y.textScale}
                        onChange={(v) => onChange('accessibility', { ...a11y, textScale: v })}
                        min={0.8}
                        max={2}
                        step={0.1}
                        label="x"
                    />
                </Row>
            </PreviewCard>

            {/* Accessibility Preview */}
            <PreviewCard>
                <h4 className="text-sm font-semibold mb-3">Preview with current settings</h4>
                <div className={`
                    p-4 rounded-lg border
                    ${a11y.highContrast ? 'border-yellow-400 bg-black text-white' : 'border-border bg-surface'}
                    ${a11y.dyslexiaFriendly ? 'font-open-dyslexic' : ''}
                `}
                style={{ 
                    fontSize: `${a11y.textScale}rem`,
                    filter: a11y.colorVision !== 'default' 
                        ? a11y.colorVision === 'achromatopsia' ? 'grayscale(100%)' 
                        : `url(#${a11y.colorVision})`
                        : 'none'
                }}>
                    <p className="mb-2 font-medium">Sample text with current accessibility settings</p>
                    <p className="text-sm opacity-80">
                        This is how your content will appear to users with these accessibility preferences enabled.
                        The quick brown fox jumps over the lazy dog.
                    </p>
                </div>
            </PreviewCard>
        </div>
    );
}

function DataTab({ settings, onChange }) {
    const data = settings.data || DEFAULT_SETTINGS.data;

    return (
        <div className="space-y-8 animate-fade-in">
            <SectionHeader title="Data & Storage" description="Manage auto-save, backups, and exports" icon={Database} />

            <PreviewCard className="space-y-0">
                <Row label="Auto-Save" description="Automatically save content changes">
                    <Toggle 
                        id="data-autosave" 
                        checked={data.autoSave} 
                        onChange={(v) => onChange('data', { ...data, autoSave: v })} 
                    />
                </Row>

                <Row label="Save Interval" description="How often to auto-save (minutes)">
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            min="1"
                            max="60"
                            value={data.saveInterval}
                            onChange={(e) => onChange('data', { ...data, saveInterval: parseInt(e.target.value) || 5 })}
                            className="input-base w-20 px-3 py-1.5 text-sm text-center rounded-lg"
                            disabled={!data.autoSave}
                        />
                        <span className="text-sm text-muted">minutes</span>
                    </div>
                </Row>

                <Row label="Backup Enabled" description="Keep automatic backups of content">
                    <Toggle 
                        id="data-backup" 
                        checked={data.backupEnabled} 
                        onChange={(v) => onChange('data', { ...data, backupEnabled: v })} 
                    />
                </Row>

                <Row label="Export Format" description="Default format for data exports">
                    <Select
                        value={data.exportFormat}
                        onChange={(v) => onChange('data', { ...data, exportFormat: v })}
                        options={[
                            { value: 'json', label: 'JSON' },
                            { value: 'csv', label: 'CSV' },
                        ]}
                    />
                </Row>
            </PreviewCard>

            {/* Data Status */}
            <PreviewCard>
                <h4 className="text-sm font-semibold mb-3">Storage Status</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-surface rounded-lg">
                        <div className="text-xs text-muted">Auto-save</div>
                        <div className="text-sm font-medium mt-1">{data.autoSave ? 'Enabled' : 'Disabled'}</div>
                    </div>
                    <div className="p-3 bg-surface rounded-lg">
                        <div className="text-xs text-muted">Backup</div>
                        <div className="text-sm font-medium mt-1">{data.backupEnabled ? 'Active' : 'Inactive'}</div>
                    </div>
                    <div className="p-3 bg-surface rounded-lg">
                        <div className="text-xs text-muted">Last Backup</div>
                        <div className="text-sm font-medium mt-1">{settings.lastUpdated ? new Date(settings.lastUpdated).toLocaleDateString() : 'Never'}</div>
                    </div>
                    <div className="p-3 bg-surface rounded-lg">
                        <div className="text-xs text-muted">Format</div>
                        <div className="text-sm font-medium mt-1 uppercase">{data.exportFormat}</div>
                    </div>
                </div>
            </PreviewCard>
        </div>
    );
}

function ImportExportTab({ settings, onImport, onExport }) {
    const [exportText, setExportText] = useState('');
    const [importText, setImportText] = useState('');
    const [importStatus, setImportStatus] = useState('');

    const handleExport = () => {
        const text = JSON.stringify(settings, null, 2);
        setExportText(text);
        
        // Download file
        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cms-settings-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        if (onExport) onExport();
    };

    const handleImport = () => {
        try {
            const parsed = JSON.parse(importText);
            onImport(parsed);
            setImportStatus('success');
            setImportText('');
            setTimeout(() => setImportStatus(''), 3000);
        } catch (e) {
            setImportStatus('error');
            setTimeout(() => setImportStatus(''), 3000);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImportText(event.target.result);
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <SectionHeader title="Import / Export" description="Backup or restore your CMS configuration" icon={Download} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Export Card */}
                <PreviewCard className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <Download size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">Export Settings</h4>
                            <p className="text-xs text-muted">Download your current settings as JSON</p>
                        </div>
                    </div>

                    <button
                        onClick={handleExport}
                        className="w-full py-3 rounded-xl text-sm font-bold text-white bg-accent hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                        <Download size={16} />
                        Download Settings JSON
                    </button>

                    {exportText && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted">Preview (first 200 chars)</span>
                                <button
                                    onClick={() => setExportText('')}
                                    className="text-xs text-muted hover:text-foreground"
                                >
                                    Hide
                                </button>
                            </div>
                            <pre className="text-xs bg-surface p-3 rounded-lg overflow-auto max-h-32 border border-border">
                                {exportText.substring(0, 200)}...
                            </pre>
                        </div>
                    )}
                </PreviewCard>

                {/* Import Card */}
                <PreviewCard className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <Upload size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">Import Settings</h4>
                            <p className="text-xs text-muted">Restore from a previously exported JSON file</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept=".json,application/json"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex-1 py-2 px-3 rounded-lg border border-border text-sm text-muted hover:bg-surface cursor-pointer transition-all text-center"
                            >
                                Choose File
                            </label>
                        </div>

                        <textarea
                            rows={5}
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            placeholder="Or paste JSON settings here..."
                            className="input-base w-full px-3 py-2 text-xs font-mono rounded-lg resize-none"
                        />

                        {importStatus === 'success' && (
                            <div className="text-xs font-medium text-green-600 bg-green-50 p-2 rounded-lg flex items-center gap-1">
                                <Check size={14} /> Imported successfully
                            </div>
                        )}
                        {importStatus === 'error' && (
                            <div className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded-lg flex items-center gap-1">
                                <AlertCircle size={14} /> Invalid JSON format
                            </div>
                        )}

                        <button
                            onClick={handleImport}
                            disabled={!importText.trim()}
                            className="w-full py-2 rounded-xl text-sm font-bold border-2 border-accent text-accent hover:bg-accent/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Apply Imported Settings
                        </button>
                    </div>
                </PreviewCard>
            </div>

            {/* Quick Actions */}
            <PreviewCard className="p-6">
                <h4 className="font-semibold text-foreground mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                        onClick={() => {
                            const backup = { ...settings, lastUpdated: new Date().toISOString() };
                            localStorage.setItem('cms-settings-backup', JSON.stringify(backup));
                            alert('Settings backed up to browser storage');
                        }}
                        className="p-3 rounded-lg border border-border hover:bg-surface transition-all text-center"
                    >
                        <Database size={18} className="mx-auto mb-1 text-accent" />
                        <span className="text-xs">Local Backup</span>
                    </button>
                    <button
                        onClick={() => {
                            const backup = localStorage.getItem('cms-settings-backup');
                            if (backup) {
                                try {
                                    onImport(JSON.parse(backup));
                                } catch (e) {
                                    alert('No valid backup found');
                                }
                            } else {
                                alert('No backup found');
                            }
                        }}
                        className="p-3 rounded-lg border border-border hover:bg-surface transition-all text-center"
                    >
                        <RefreshCw size={18} className="mx-auto mb-1 text-accent" />
                        <span className="text-xs">Restore Backup</span>
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('Reset all settings to defaults?')) {
                                onImport(DEFAULT_SETTINGS);
                            }
                        }}
                        className="p-3 rounded-lg border border-border hover:bg-surface transition-all text-center"
                    >
                        <Zap size={18} className="mx-auto mb-1 text-accent" />
                        <span className="text-xs">Reset to Defaults</span>
                    </button>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
                            alert('Settings copied to clipboard');
                        }}
                        className="p-3 rounded-lg border border-border hover:bg-surface transition-all text-center"
                    >
                        <Code size={18} className="mx-auto mb-1 text-accent" />
                        <span className="text-xs">Copy JSON</span>
                    </button>
                </div>
            </PreviewCard>
        </div>
    );
}

/* ==================== MAIN SETTINGS COMPONENT ==================== */

const subTabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'ui', label: 'UI & Layout', icon: Layout },
    { id: 'site', label: 'Site Info', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'accessibility', label: 'Accessibility', icon: Zap },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'importexport', label: 'Import/Export', icon: Download },
];

export default function Settings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState('appearance');
    const [subOpen, setSubOpen] = useState(false);
    const [error, setError] = useState(null);

    // Load settings from MongoDB
        useEffect(() => {
        const loadSettings = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/settings`, { credentials: 'include' });
                if (response.ok) {
                    //const data = await response.json();
                    //setSettings(data);
                     const data = await response.json();
                // ✅ Fix: Extract the actual settings from data.data
                if (data && data.data) {
                    setSettings(data.data);
                } else {
                    setSettings(DEFAULT_SETTINGS);
                    setError('Using default settings');
                }
                } else {
                    setSettings(DEFAULT_SETTINGS);
                    setError('Using default settings');
                }
            } catch (error) {
                setSettings(DEFAULT_SETTINGS);
                setError('Using default settings - connection error');
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

     const handleSave = async () => {
        setSaving(true);
        try {
            const toSave = { ...settings, lastUpdated: new Date().toISOString() };
            const response = await fetch(`${API_BASE}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(toSave)
            });
            if (response.ok) {
                setSaved(true);
                window.dispatchEvent(new CustomEvent('settings-updated'));
                setTimeout(() => setSaved(false), 2500);
            } else {
                setError('Failed to save');
            }
        } catch (error) {
            setError('Network error');
        } finally {
            setSaving(false);
        }
    };

    const handleImport = (imported) => {
        const merged = { ...DEFAULT_SETTINGS, ...imported, lastUpdated: new Date().toISOString() };
        setSettings(merged);
        applySettingsToDOM(merged);   // apply immediately
        window.dispatchEvent(new CustomEvent('settings-updated'));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-muted">
                <RefreshCw className="animate-spin mr-3" size={24} />
                <span className="text-lg">Loading settings from MongoDB...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Settings</h2>
                    <p className="text-sm text-muted mt-1">Configure site appearance, content, and behavior</p>
                    {error && (
                        <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg inline-flex items-center gap-1">
                            <AlertCircle size={12} />
                            {error}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`
                            flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all
                            ${saved ? 'bg-green-500' : 'bg-accent hover:opacity-90'}
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {saving ? (
                            <RefreshCw className="animate-spin" size={18} />
                        ) : saved ? (
                            <Check size={18} />
                        ) : (
                            <Save size={18} />
                        )}
                        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save to MongoDB'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sub-Tab Navigation */}
                <div className="lg:col-span-3">
                    {/* Mobile dropdown */}
                    <div className="lg:hidden mb-2">
                        <button
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-surface border border-border text-sm font-medium"
                            onClick={() => setSubOpen(!subOpen)}
                        >
                            <span className="flex items-center gap-2">
                                {subTabs.find(t => t.id === activeSubTab)?.icon && 
                                    React.createElement(subTabs.find(t => t.id === activeSubTab).icon, { size: 18, className: 'text-accent' })}
                                {subTabs.find(t => t.id === activeSubTab)?.label}
                            </span>
                            <ChevronDown size={16} className={`transition-transform ${subOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {subOpen && (
                            <div className="mt-1 border border-border rounded-xl overflow-hidden">
                                {subTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeSubTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveSubTab(tab.id);
                                                setSubOpen(false);
                                            }}
                                            className={`
                                                w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all
                                                ${isActive 
                                                    ? 'bg-accent/10 text-accent' 
                                                    : 'text-muted hover:bg-surface hover:text-foreground'
                                                }
                                                border-b last:border-b-0 border-border
                                            `}
                                        >
                                            <Icon size={16} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Desktop sidebar */}
                    <nav className="hidden lg:block space-y-1 sticky top-20">
                        {subTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeSubTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveSubTab(tab.id)}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                        ${isActive 
                                            ? 'bg-accent/10 text-accent border-l-4 border-accent' 
                                            : 'text-muted hover:bg-surface hover:text-foreground'
                                        }
                                    `}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="lg:col-span-9">
                    <div className="bg-background border border-border rounded-xl p-6">
                        {activeSubTab === 'appearance' && <AppearanceTab settings={settings} onChange={handleChange} />}
                        {activeSubTab === 'typography' && <TypographyTab settings={settings} onChange={handleChange} />}
                        {activeSubTab === 'ui' && <UITab settings={settings} onChange={handleChange} />}
                        {activeSubTab === 'site' && <SiteTab settings={settings} onChange={handleChange} />}
                        {activeSubTab === 'notifications' && <NotificationsTab settings={settings} onChange={handleChange} />}
                        {activeSubTab === 'accessibility' && <AccessibilityTab settings={settings} onChange={handleChange} />}
                        {activeSubTab === 'data' && <DataTab settings={settings} onChange={handleChange} />}
                        {activeSubTab === 'importexport' && (
                            <ImportExportTab 
                                settings={settings} 
                                onImport={handleImport}
                                onExport={() => console.log('Settings exported')}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Last Updated Info */}
            {settings?.lastUpdated && (
                <div className="text-xs text-muted text-right">
                    Last updated: {new Date(settings.lastUpdated).toLocaleString()}
                </div>
            )}
        </div>
    );
}
