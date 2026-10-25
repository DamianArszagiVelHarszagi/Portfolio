<?php

namespace App\Filament\Resources\Projects\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')
                    ->required(),
                TextInput::make('title')
                    ->required(),
                Select::make('category')
                    ->options([
                        'Course Project' => 'Course Project',
                        'School Assignment' => 'School Assignment',
                        'Personal Project' => 'Personal Project',
                        'Client Work' => 'Client Work',
                        'Group Project' => 'Group Project',
                    ])
                    ->required(),
                Select::make('type')
                    ->options([
                        'fullStack' => 'Full Stack',
                        'frontEnd' => 'Front End',
                        'backEnd' => 'Back End',
                    ])
                    ->required(),
                Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),
                TagsInput::make('tools')
                    ->required()
                    ->columnSpanFull(),
                FileUpload::make('image')
                    ->image()
                    ->disk('public')
                    ->directory('works'),
                TextInput::make('alt'),
                TextInput::make('role')
                    ->placeholder('Front-end developer'),
                TextInput::make('team')
                    ->placeholder('Solo, or names'),
                TextInput::make('year')
                    ->placeholder('2025'),
                TextInput::make('duration')
                    ->placeholder('6 weeks'),
                TextInput::make('github_url')
                    ->url(),
                TextInput::make('live_url')
                    ->url(),
                TextInput::make('position')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
